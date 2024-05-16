export class UserDTO {
    email;
    role;
    id;
    name;
    surname;
    isActivated;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.role = model.role;
        this.name = model.name;
        this.surname = model.surname;
    }
}
