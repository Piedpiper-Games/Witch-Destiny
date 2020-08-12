//(function(window,undefined){

function Bubble(message, time_stay, person_image, is_right) {
    this.initialize(message, time_stay, person_image, is_right);
}

Bubble.prototype = new Drawable();
Bubble.prototype.drawable_initialize = Bubble.prototype.initialize;
Bubble.prototype.initialize = function (message, time_stay, person_image, is_right) {
    this.drawable_initialize();

    this.message = message;
    this.time_stay = time_stay;

    for (var i = 0; i < 4; i++)
        if (typeof (message[i]) === "undefined")
            this.message[i] = " ";

    this.c1 = new Sprite('white_circle');
    this.c1.set_scale(0.1);
    this.c1.set_anchor(0.5, 0.5);
    this.add_child(this.c1);
    this.c1.set_alpha(0);

    this.c2 = new Sprite('white_circle');
    this.c2.set_scale(0.1);
    this.c2.set_anchor(0.5, 0.5);
    this.add_child(this.c2);
    this.c2.set_alpha(0);

    this.c3 = new Sprite('white_circle');
    this.c3.set_scale(0.1);
    this.c3.set_anchor(0.5, 0.5);
    this.add_child(this.c3);
    this.c3.set_alpha(0);

    this.bubble = new Sprite('dialog');
    this.bubble.set_alpha(0);
    this.bubble.set_anchor(0.5, 0.5);
    this.bubble.set_scale(0.4);
    this.add_child(this.bubble);

    this.person_pic = new Sprite(person_image);
    this.bubble.add_child(this.person_pic);

    this.label1 = new Label();
    this.label1.set({text: this.message[0]});
    this.label1.set({text_color: "#000000"});
    this.label1.set({text_size: 40});
    this.label1.set({text_font_name: "WAKINGTHEWITCH"});
    this.label1.set_alpha(0);
    this.add_child(this.label1);

    this.label2 = new Label();
    this.label2.set({text: this.message[1]});
    this.label2.set({text_color: "#000000"});
    this.label2.set({text_size: 40});
    this.label2.set({text_font_name: "WAKINGTHEWITCH"});
    this.label2.set_alpha(0);
    this.add_child(this.label2);

    this.label3 = new Label();
    this.label3.set({text: this.message[2]});
    this.label3.set({text_color: "#000000"});
    this.label3.set({text_size: 40});
    this.label3.set({text_font_name: "WAKINGTHEWITCH"});
    this.label3.set_alpha(0);
    this.add_child(this.label3);

    this.label4 = new Label();
    this.label4.set({text: this.message[3]});
    this.label4.set({text_color: "#000000"});
    this.label4.set({text_size: 40});
    this.label4.set({text_font_name: "WAKINGTHEWITCH"});
    this.label4.set_alpha(0);
    this.add_child(this.label4);

    if (is_right) {
        this.c1.set_position(10, 40);
        this.c2.set_position(50, 10);
        this.c3.set_position(90, -30);
        this.bubble.set_position(280, -160);
        this.person_pic.set_position(60, 0);
        this.label1.set_position(120, -250);
        this.label2.set_position(120, -200);
        this.label3.set_position(120, -150);
        this.label4.set_position(120, -100);
    }
    else
    {
        this.c1.set_position(10, 40);
        this.c2.set_position(-30, 10);
        this.c3.set_position(-70, -30);
        this.bubble.set_position(-260, -160);
        this.person_pic.set_position(-230, 90);
        this.label1.set_position(-420, -260);
        this.label2.set_position(-420, -210);
        this.label3.set_position(-420, -160);
        this.label4.set_position(-420, -110);
    }
};

Bubble.prototype.show = function () {

    var that = this;

    var t = new TweenAlpha(that.c1, 1, null, 200);
    t.run();

    var t2 = new TweenScale(that.c1, 0.3, new Bezier(.28, .63, .49, 1.4), 200);
    t2.run();

    setTimeout(function () {
        var t = new TweenAlpha(that.c2, 1, null, 200);
        t.run();

        var t2 = new TweenScale(that.c2, 0.6, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, 100);

    setTimeout(function () {
        var t = new TweenAlpha(that.c3, 1, null, 200);
        t.run();

        var t2 = new TweenScale(that.c3, 0.9, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, 200);


    setTimeout(function () {
        var t = new TweenAlpha(that.bubble, 1, null, 200);
        t.run();

        var t2 = new TweenScale(that.bubble, 1.4, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, 300);


    setTimeout(function () {
        var t = new TweenAlpha(that.label1, 1, null, 200);
        t.run();

        var t2 = new TweenScale(that.label1, 1.4, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, 400);

    setTimeout(function () {
        var t = new TweenAlpha(that.label2, 1, null, 200);
        t.run();

        var t2 = new TweenScale(that.label2, 1.4, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, 500);

    setTimeout(function () {
        var t = new TweenAlpha(that.label3, 1, null, 200);
        t.run();

        var t2 = new TweenScale(that.label3, 1.4, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, 600);

    setTimeout(function () {
        var t = new TweenAlpha(that.label4, 1, null, 200);
        t.run();

        var t2 = new TweenScale(that.label4, 1.4, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, 700);

    //remove components
    setTimeout(function () {
        var t = new TweenAlpha(that.label1, 0, null, 200);
        t.run();

        var t2 = new TweenScale(that.label1, 1.4, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, that.time_stay + 700);

    setTimeout(function () {
        var t = new TweenAlpha(that.label2, 0, null, 200);
        t.run();

        var t2 = new TweenScale(that.label2, 1.4, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, that.time_stay + 800);

    setTimeout(function () {
        var t = new TweenAlpha(that.label3, 0, null, 200);
        t.run();

        var t2 = new TweenScale(that.label3, 1.4, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, that.time_stay + 900);


    setTimeout(function () {
        var t = new TweenAlpha(that.label4, 0, null, 200);
        t.run();

        var t2 = new TweenScale(that.label4, 1.4, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, that.time_stay + 1000);


    setTimeout(function () {
        var t = new TweenAlpha(that.bubble, 0, null, 200);
        t.run();

        var t2 = new TweenScale(that.bubble, 1.4, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, that.time_stay + 1100);

    setTimeout(function () {
        var t = new TweenAlpha(that.c3, 0, null, 200);
        t.run();

        var t2 = new TweenScale(that.c3, 0.9, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, that.time_stay + 1200);

    setTimeout(function () {
        var t = new TweenAlpha(that.c2, 0, null, 200);
        t.run();

        var t2 = new TweenScale(that.c2, 0.6, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, that.time_stay + 1300);


    setTimeout(function () {
        var t = new TweenAlpha(that.c1, 0, null, 200);
        t.run();

        var t2 = new TweenScale(that.c1, 0.6, new Bezier(.28, .63, .49, 1.4), 200);
        t2.run();
    }, that.time_stay + 1400);



};

Bubble.prototype.on_added_to_parent = function (parent) {
    Drawable.prototype.on_added_to_parent.call(this, parent);

};

Bubble.prototype.on_remove_from_parent = function (parent) {
    Drawable.prototype.on_remove_from_parent.call(this, parent);

};

Bubble.prototype.draw = function (context) {

};

Bubble.prototype.clear = function (context) {

};

//    window.Bubble = Bubble;

//}(window));
