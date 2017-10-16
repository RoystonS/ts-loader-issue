import { AnInterface } from "./f1";

function ADecorator(target: Function) {}

@ADecorator
export class AClass {
  constructor(value: AnInterface) {}
}
