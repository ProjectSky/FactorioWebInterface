import { ObservableErrors } from "../../utils/observableErrors";
import { ObservableObject } from "../../utils/observableObject";
import { Validator, PropertyValidation, ValidationResult } from "../../utils/validation/module";
export class ViewModel extends ObservableObject {
    constructor() {
        super();
        this._fields = {
            name: null,
            age: null,
            prop1: null,
            prop2: null,
            prop2Enabled: null,
            message: null
        };
        this.errors = new ObservableErrors();
        this._validator = new Validator(this, [
            new PropertyValidation('age').displayName('Age').rules({ validate: this.ageRule })
        ]);
    }
    get name() {
        return this._fields.name;
    }
    set name(value) {
        this.set('name', value);
    }
    get age() {
        return this._fields.age;
    }
    set age(value) {
        this.set('age', value);
    }
    get prop1() {
        return this._fields.prop1;
    }
    set prop1(value) {
        if (this.set('prop1', value)) {
            this.prop2 = this.prop1;
        }
    }
    get prop2() {
        return this._fields.prop2;
    }
    set prop2(value) {
        if (this.set('prop2', value)) {
            this.prop1 = this.prop2;
        }
    }
    get prop2Enabled() {
        return this._fields.prop2Enabled;
    }
    set prop2Enabled(value) {
        this.set('prop2Enabled', value);
    }
    get message() {
        return this._fields.message;
    }
    set message(value) {
        this.set('message', value);
    }
    set(propertyName, value) {
        if (this.setAndRaise(this._fields, propertyName, value)) {
            let validationResult = this._validator.validate(propertyName);
            this.errors.setError(propertyName, validationResult);
            return true;
        }
        return false;
    }
    ageRule(vm) {
        let age = vm.age;
        if (age < 10) {
            return ValidationResult.error('be greater than 9');
        }
        else if (age > 20) {
            return ValidationResult.error('be less than 21');
        }
        return ValidationResult.validResult;
    }
}
//# sourceMappingURL=vm.js.map