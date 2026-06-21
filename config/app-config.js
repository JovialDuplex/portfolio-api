const configApp = function(app, express){
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
};

module.exports = configApp