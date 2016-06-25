/**
 * Created by timo on 29.05.16.
 */

ccm.component( {

    name: 'coutree',

    config: {
        html:  [ ccm.store, { local: '../coutree/template.json' } ],
        jstreelib: [ccm.load, 'https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/jstree.min.js'],
        jstreecss: [ccm.load, 'https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/themes/default/style.min.css'],
        store: [ ccm.store, { url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'coutree' } ],
        key: "test",
        user:  [ ccm.instance, 'http://kaul.inf.h-brs.de/ccm/components/user2.js' ]

    },

    Instance: function () {

        var self = this;

        //init
        self.init = function ( callback ) {
            // listen to change event of ccm realtime datastore => update own content
            self.store.onChange = function () { self.render(); };
            callback();

        };

        //render
        self.render = function ( callback ) {

            var element = ccm.helper.element( self );
            self.store.get( self.key, function ( dataset ) {
                if ( dataset === null )
                    self.store.set( { key: self.key, main: [] }, proceed );
                else
                    proceed( dataset );

                function proceed( dataset ) {

                    element.html( ccm.helper.html( self.html.get( 'main' ) ) );
                    $('.tree').jstree({
                        "core" : {
                            "animation" : 0,
                            "check_callback" : true,
                            "themes" : { "stripes" : true },
                        },
                        "types" : {
                            "#" : {
                                "max_children" : 1,
                                "max_depth" : 4,
                                "valid_children" : ["root"]
                            },
                            "root" : {
                                "icon" : "vakata-jstree-7a976d1/static/3.3.1/assets/images/tree_icon.png",
                                "valid_children" : ["default"]
                            },
                            "default" : {
                                "valid_children" : ["default","file"]
                            },
                            "file" : {
                                "icon" : "glyphicon glyphicon-file",
                                "valid_children" : []
                            }
                        },
                        "plugins" : [
                            "contextmenu", "dnd", "search",
                            "state", "types", "wholerow"
                        ]
                    });
                    $('.tree').on("create_node.jstree", function (e, data) {
                        self.user.login( function () {

                            // add submitted message in dataset for rendering
                            dataset.node.push( { user: self.user.data().key} );
                        } );
                    });


                    // prevent page reload (for input)
                    //return false;
                }
            });

            if (callback) callback();
        }

    }

});
