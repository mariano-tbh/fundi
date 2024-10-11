import {Effect, EffectAction} from '@lib/r8y/effect.js';
import {Destroyable, IDestroyable} from '../../r8y/destroyable.js';
import {ReactiveContext} from '../../r8y/reactive-context.js';
import {Subscribable} from '../../r8y/subscribable.js';
import {ComponentContext} from '../directives/component.js';

export function $effect(action: EffectAction) {
	const ref = new Effect(action);

	ref.run();

	ComponentContext.value.add(ref);

	return ref;
}
