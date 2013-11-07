var spin = Spin()
    , Game;
var curr_index = 0
    , max_index = 0
    , r, subCat, row
    , pc, p, c = 0
    , heading, product, shelf;
Game = {
    map: {
        width: 700,
        height: 569,
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
    start: function() {;
        window.__db = window.__db || {}
        Crafty.scene('store', function() {
            
            // Initialize Spinner
            spin.init('spinner');
            
            // Start loader.
            spin.start();
            
            // Initialize Scene
            var g = Crafty.init(Game.map.width, Game.map.height);
            
            shelf = Crafty.e('2D, Canvas, Tween, Image').image('assets/img/shelf4.jpg')
                .attr({w: Game.map.width, h: Game.map.height});
        
            g.bind('KeyDown', function(e) {
                if (e.key === Crafty.keys['RIGHT_ARROW']) {
                    if (typeof window.__db.__categories[curr_index + 1] === 'undefined') {
                        alert('No more items on shelf!');
                        return false;
                    }
                    resetLayout();
                    preBuild(curr_index + 1);
                } else if (e.key === Crafty.keys['LEFT_ARROW']) {
                    if (typeof window.__db.__categories[curr_index - 1] === 'undefined') {
                        alert('No more items on shelf!');
                        return false;
                    }
                    resetLayout();
                    preBuild(curr_index - 1);
                }
            });
            
            // Heading text.
            heading = Crafty.e("2D, DOM, Text")
                    .attr({ x: Game.map.width / 2, y: 20 })
                    .text('')
                    .textFont({size: '20px', weight: 'bold' })
                    .textColor('#000000');
            
            // Background Image.
            //Crafty.background("url('assets/img/shelf4.jpg')");
            
            // Load categories
            Game.getCategories(function(data) {
                if (data.success === true) {
                    window.__db.__categories = data.categories;
                    max_index = window.__db.__categories.length - 1;
                    preBuild(0);
                }
            });
            function resetLayout() {
                Crafty.canvas.context.clearRect(0, 0, Game.map.width, Game.map.height);
                $('.img-tooltip').remove();
                    pc = undefined, 
                    r = undefined, 
                    p = undefined,
                    row = undefined, 
                    subCat = undefined;
                    c = 0;
            }
            function preBuild(k) {
                curr_index = k;
                row = window.__db.__categories[k] || {};
                writeCategoryName(row);
                renderShelf(row);
            }
            
            function renderShelf(i) {
                subCat = i.categories;
                if ( subCat !== null && subCat.length > 0) {
                    // Nested. Render row shelf.
                    if (typeof subCat[0] !== 'undefined') {
                        renderShelfRow(subCat[0], parseInt(r)+1);
                    }
                    /*
                     * for (r in subCat) {
                        renderShelfRow(subCat[r], parseInt(r)+1);
                    }
                     */
                }
            }
            
            function renderShelfRow(i, inc) {
                pc = inc === 1 ? 0 : 70;
                Crafty.e("2D, Canvas, Text")
                    .attr({ x: 60, y: (Game.map.row.height * inc) + pc })
                    .text(i.name)
                    .textFont({size: '20px', weight: 'bold' })
                    .textColor('#000000');
                Game.getProducts(i, function(data) {
                    
                    if ( data.success === true) {
                        for (p in data.products) {
                            ++c;
                            product = data.products[p];
                            Crafty.e("DOM, HTML")
                                .attr({
                                    x: 30 * (p * 2),
                                    y: 95 + (c === 1 ? 1 :  c * 2),
                                    w: Game.map.box.width,
                                    h: Game.map.box.height
                                })
                                .replace('<img rel="tooltip" class="img-tooltip" src="assets/img/box_100x100.png" title="'+product.name +'" data-content="My content here." />');
                        }
                        $('.img-tooltip').tooltip();
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
            beforeSend: function() {
                spin.start();
                shelf.alpha = 0.6;
            },
            success: function(data) {
                cb(data);
            },
            error: function() {
                alert("unable to get products!");
            },
            complete: function() {
                setTimeout(function() {
                    spin.stop();
                    shelf.alpha = 1;
                }, 1000);
            }
        });
    }
}