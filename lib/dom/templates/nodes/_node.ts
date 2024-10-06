import { Destroyable } from "@lib/r8y/destroyable.js";

export abstract class TemplateNode extends Destroyable {
    abstract mount(): void;
}