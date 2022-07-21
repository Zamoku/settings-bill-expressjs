const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const BillWithSettings = require('./settings-bill')
const moment = require('moment');

moment().format()


const app = express();
const settingsBill = BillWithSettings(); 

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'))

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

//parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.render('index', {
        setting: settingsBill.getSettings(),
        totals: settingsBill.totals(),
        totalClassName: settingsBill.totalClassName()
    })
});

app.post('/settings', function(req, res){

    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });

    console.log(settingsBill.getSettings())
    res.redirect('/')
})

app.post('/action', function(req, res){
    //capture the call type to add
    settingsBill.recordAction(req.body.actionType)

    res.redirect('/')
});

app.get('/actions', function(req, res){
    res.render('actions', {actions: settingsBill.actions() 
    
    })
     for (let actionList of settingsBill.actions()) {
        console.log(actionList.time)
        actionList.time = moment(actionList.timestamp,'MMMM Do YYYY, h:mm:ss a').fromNow()
     }


});

app.get('/actions/:actionType', function(req, res){
    const actionType = req.params.actionType;
    res.render('actions', {actions: settingsBill.actionsFor(actionType) })
 
});

const PORT = process.env.PORT || 3012

app.listen(PORT, function(){
    console.log("App started at port:", PORT)
});