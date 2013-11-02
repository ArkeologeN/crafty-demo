Game = {
    map: {
        width: 600,
        height: 600,
        box: {
            width: 60,
            height: 60
        }
    },
    start: function() {
        Crafty.scene('store', function() {
            Crafty.init(Game.map.width, Game.map.height);
            Crafty.background("url('assets/img/shelf.jpg')");
            var i = 1;
            for (i = 1; i <= 20; i++) {
                var box = Crafty.e('2D, DOM, Image').image('assets/img/box.png')
                .attr({
                    x: 50 * i,
                    y: 240 - (i * 3),
                    w: Game.map.box.width,
                    h: Game.map.box.height
                });
            }
        });
        
        Crafty.scene('store');
        /*
         * Crafty.init(Game.map.width, Game.map.height);
        Crafty.background('green');
        //Crafty.e('2D, DOM, Image').image('assets/img/shelf.jpg');
        var x = Crafty.e('2D, Canvas, Color')
        .attr({
            x: 50,
            y: 60,
            w: Game.map.box.width,
            h: Game.map.box.height
        })
        .color('rgb(0, 0, 0)');
         */
    }
}