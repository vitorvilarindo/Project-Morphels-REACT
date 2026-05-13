class AbstractCreateClass {
    constructor() {
        if (new.target === AbstractCreateClass) {
            throw new TypeError("Is Impossible instance this abstract class")
        }
    }
}