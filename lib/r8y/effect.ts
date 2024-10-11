import {Destroyable} from './destroyable';
import {ReactiveContext} from './reactive-context';
import {Subscribable} from './subscribable';

export type EffectAction = ({signal}: {signal: AbortSignal}) => void;

export class Effect extends Destroyable {
	readonly #action: EffectAction;

	constructor(action: EffectAction) {
		super();
		this.#action = action;
	}

	get [Symbol.toStringTag]() {
		return `Effect(?)`;
	}

	run() {
		let controller: AbortController | null = null;

		const act = () => {
			controller?.abort();
			controller = new AbortController();
			this.#action({signal: controller.signal});
		};

		const deps = new Set<Subscribable>();

		const _ = ReactiveContext.run(deps, act);

		const unsubAll = Subscribable.forEach(deps, act);

		this.onDestroy(() => {
			unsubAll();
			controller?.abort();
		});

		return this;
	}
}
