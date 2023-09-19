const Turtle = function (data) {
    this.point = new Turtle.Point({ x: data.x, y: data.y });
    this.vector = new Turtle.Vector({ x: data.vx, y: data.vy });
    return this;
};

Turtle.prototype.turn = function (angle) {
    this.vector.rotate(angle);
    return this;
};

Turtle.prototype.turnLeft = function () {
    this.vector.rotate(-Math.PI / 2);
    return this;
};

Turtle.prototype.turnRight = function () {
    this.vector.rotate(Math.PI / 2);
    return this;
};

Turtle.prototype.move = function (len) {
    this.vector.setLength(Math.abs(len));
    if (len > 0) {
        this.point.add(this.vector);
    } else {
        this.point.subtract(this.vector);
    }
    return this;
};

Turtle.prototype.getPoint = function () {
    return { x: this.point.x, y: this.point.y };
};

Turtle.Point = function (data) {
    this.x = data.x;
    this.y = data.y;
};

Turtle.Point.prototype.add = function (otherPoint) {
    this.x += otherPoint.x;
    this.y += otherPoint.y;
};

Turtle.Point.prototype.subtract = function (otherPoint) {
    this.x -= otherPoint.x;
    this.y -= otherPoint.y;
};

Turtle.Vector = function (data) {
    this.x = data.x;
    this.y = data.y;
};

Turtle.Vector.prototype.rotate = function (phi) {
    let newX = this.x * Math.cos(phi) - this.y * Math.sin(phi);
    let newY = this.x * Math.sin(phi) + this.y * Math.cos(phi);
    this.x = newX;
    this.y = newY;
};

Turtle.Vector.prototype.setLength = function (newLen) {
    let currLen = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x = this.x / currLen * newLen;
    this.y = this.y / currLen * newLen;
};
