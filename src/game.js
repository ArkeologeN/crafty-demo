Game = {
    map: {
        width: 1280,
        height: 768,
        box: {
            width: 100,
            height: 100
        },
        request: {
            url_get_categories: 'http://mysma.gnstudio.biz/index.php?route=feed/web_api/categories&parent=0&level=2',
            url_get_products: 'http://mysma.gnstudio.biz/index.php?route=feed/web_api/products&limit=10'
        },
        row: {
            height: 70
        }
    },
    start: function() {
        window.__db = window.__db || {}
        Crafty.scene('store', function() {
            var curr_index = 0
                , max_index = 0
                , r
                , subCat
                , row
                , pc
                , p
                , c = 0
                , heading;
            var g = Crafty.init(Game.map.width, Game.map.height);
            g.bind('KeyDown', function(e) {
                if (e.key === Crafty.keys['RIGHT_ARROW']) {
                    Crafty.canvas.context.clearRect(0, 0, Game.map.width, Game.map.height);
                    pc = undefined, 
                    r = undefined, 
                    p = undefined,
                    row = undefined, 
                    subCat = undefined;
                    c = 0;
                    console.log(pc, r, p, row, subCat, c);
                    preBuild(curr_index + 1);
                    //console.log(window.__db.__categories, curr_index, max_index);
                }
            });
            heading = Crafty.e("2D, DOM, Text")
                    .attr({ x: Game.map.width / 2, y: 20 })
                    .text('')
                    .textFont({size: '20px', weight: 'bold' })
                    .textColor('#000000');
            Crafty.background("url('assets/img/shelf2.png')");
            Game.getCategories(function(data) {
                if (data.success === true) {
                    window.__db.__categories = data.categories;
                    max_index = window.__db.__categories.length - 1;
                    preBuild(0);
                }
            });
            
            function preBuild(k) {
                if ( k > max_index)
                    throw Error("Index out of bound");
                
                curr_index = k;
                row = window.__db.__categories[k] || {};
                writeCategoryName(row);
                renderShelf(row);
            }
            
            function renderShelf(i) {
                subCat = i.categories;
                if ( subCat !== null && subCat.length > 0) {
                    // Nested. Render row shelf.
                    for (r in subCat) {
                        renderShelfRow(subCat[r], parseInt(r)+1);
                    }
                }
            }
            
            function renderShelfRow(i, inc) {
                pc = inc === 1 ? 0 : 80;
                Crafty.e("2D, Canvas, Text")
                    .attr({ x: 60, y: (Game.map.row.height * inc) + pc })
                    .text(i.name)
                    .textFont({size: '20px', weight: 'bold' })
                    .textColor('#000000');
                Game.getProducts(i, function(data) {
                    c++;
                    console.log(c);
                    if ( data.success === true) {
                        for (p in data.products) {
                            Crafty.e('2D, Canvas, Image').image('assets/img/box_100x100.png')
                            .attr({
                                x: 50 * (p * 2),
                                y: 75 * (c === 1 ? 1 :  c * 1.45),
                                w: Game.map.box.width,
                                h: Game.map.box.height
                            });
                        }
                    }
                });
            }
            
            function writeCategoryName(i) {
                heading.text(i.name);
            }
            
        });
        
        Crafty.scene('store');
    },
    getCategories: function(cb) {
        $.ajax({
            url: Game.map.request.url_get_categories,
            success: function(data) {
                cb(data);
            },
            error: function() {
                alert("Error occured to get categories!");
            }
        });
    },
    getProducts: function(o, cb) {
        $.ajax({
            url: Game.map.request.url_get_products+"&category="+o.category_id,
            async: true,
            success: function(data) {
                cb(data);
            },
            error: function() {
                alert("unable to get products!");
            }
        });
    }
}