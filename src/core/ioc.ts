import {AsyncLocalStorage} from 'node:async_hooks';
import type {Provider} from './provider';
import type {Token} from './token';

export type ScopeKind = 'singleton' | 'request' | 'transient';

export type Resolver = {
	resolve<T>(token: Token<T>): Promise<T>;
};

export abstract class DefaultScope implements Resolver {
	readonly #kind: ScopeKind;
	readonly #deps: Map<Token<unknown>, Provider>;
	readonly #ct: Resolver;

	constructor(kind: ScopeKind, ct: Resolver) {
		this.#kind = kind;
		this.#deps = new Map();
		this.#ct = ct;
	}

	get kind() {
		return this.#kind;
	}

	get deps() {
		return this.#deps.entries();
	}

	async resolve<T>(token: Token<T>): Promise<T> {
		const config = this.#deps.get(token);

		if (typeof config === 'undefined') {
			let message = `implementation for ${token.description} has not been provided in the current ${
				this.#kind
			}-scope`;

			message += `. did you forget to implement this service definition?`;

			throw new Error(message);
		}

		if ('value' in config) {
			return config.value as T;
		}

		const promises = config.deps.map((dep) => {
			return this.#ct.resolve(dep);
		});

		const deps = await Promise.all(promises);

		return config.factory(...deps) as Promise<T>;
	}

	has(token: Token) {
		return this.#deps.has(token);
	}

	add(provider: Provider) {
		this.#deps.set(provider.token, provider);
		return this;
	}
}

export class RequestScope extends DefaultScope {
	readonly #asl: AsyncLocalStorage<Map<Token, unknown>>;

	constructor(ct: Resolver) {
		super('request', ct);
		this.#asl = new AsyncLocalStorage();
	}

	run<T>(callback: () => T) {
		const deps = new Map<Token, unknown>();

		return this.#asl.run(deps, callback);
	}

	async resolve<T>(token: Token<T>): Promise<T> {
		const store = this.#asl.getStore();

		if (typeof store === 'undefined') {
			throw new Error(
				"using request-scoped provider outside of a request's scope. did you forget to call RequestScope.run(...) in your request pipeline? this can be done via middleware of your preferred routing library.",
			);
		}

		let resolved: T | undefined = store.get(token) as T;

		if (typeof resolved === 'undefined') {
			resolved = await super.resolve(token);
			store.set(token, resolved);
		}

		return resolved;
	}
}

export class TransientScope extends DefaultScope {
	constructor(ct: Resolver) {
		super('transient', ct);
	}
}

export class SingletonScope extends DefaultScope {
	readonly #deps: Map<Token, unknown>;

	constructor(ct: Resolver) {
		super('singleton', ct);
		this.#deps = new Map();
	}

	async resolve<T>(token: Token<T>): Promise<T> {
		let resolved: T | undefined = this.#deps.get(token) as T;

		if (typeof resolved === 'undefined') {
			resolved = await super.resolve(token);
			this.#deps.set(token, resolved);
		}

		return resolved;
	}
}

export type AddConfig = {
	scope?: ScopeKind;
};

export class Container {
	readonly #scope;

	constructor() {
		this.#scope = Object.freeze({
			singleton: new SingletonScope(this),
			transient: new TransientScope(this),
			request: new RequestScope(this),
		} as const satisfies Record<ScopeKind, DefaultScope>);

		this.run = this.#scope.request.run.bind(this.#scope.request);
	}

	get scope() {
		return this.#scope;
	}

	/**
	 * register a provider in the current IOC container.
	 */
	add(provider: Provider<Token<any>, Token<any>[]>, options: AddConfig = {}) {
		const {scope = 'singleton'} = options;

		for (const _scope of Object.values(this.#scope)) {
			if (_scope.has(provider.token)) {
				throw new Error(
					`provider ${provider.token.description} has already been registered in the ${_scope.kind} scope. it's not possible to register the same provider twice in the same container.`,
				);
			}
		}

		this.#scope[scope].add(provider);

		return this;
	}

	resolve<T>(token: Token<T>): Promise<T> {
		for (const _scope of Object.values(this.#scope)) {
			if (_scope.has(token)) {
				return _scope.resolve(token);
			}
		}

		throw new Error(
			`could not find an implementation for ${token.description} in the current IOC container or scope. please check that you've correctly registered a provider for it via Container.add(...)`,
		);
	}

	/**
	 * shorthand for `Container.add(provider, {scope: "request"})`
	 */
	addScoped(provider: Provider<Token<any>, Token<any>[]>) {
		return this.add(provider, {scope: 'request'});
	}

	/**
	 * shorthand for `Container.add(provider, {scope: "singleton"})`
	 */
	addSingleton(provider: Provider<Token<any>, Token<any>[]>) {
		return this.add(provider, {scope: 'singleton'});
	}

	/**
	 * shorthand for `Container.add(provider, {scope: "transient"})`
	 */
	addTransient(provider: Provider<Token<any>, Token<any>[]>) {
		return this.add(provider, {scope: 'transient'});
	}

	/**
	 * shorthand for `Container.scope.request.run(...)`
	 */
	public readonly run;
}
