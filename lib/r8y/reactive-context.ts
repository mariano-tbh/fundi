import {Context} from '../ctx/context.js';
import {Subscribable} from './subscribable.js';

export const ReactiveContext = new Context(new Set<Subscribable>());
