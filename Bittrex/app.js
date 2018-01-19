const express = require('express');
const path = require('path');
const bittrex = require('node-bittrex-api');

const app = express();

bittrex.options({
  'apikey' : 'b68e057c83424cf0a85b7e5cb97994c2',
  'apisecret' : 'de7eecb492d84bcbbb454d6b032553f4'
});

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// A GET request is made to the homepage
app.get('/', (req, res) => {
  let balances = ''
  let market = ''


  const renderIndexs = (balances,market)=>{

    let indices = [];


    for (var i in balances) {
      let thisMarket = market.find((index)=> index.MarketName === `BTC-${balances[i].Currency}`);

      console.log(thisMarket);
      console.log(typeof thisMarket);
      indices[i]= {
        Currency: balances[i].Currency,
        BTCrate: thisMarket
      };
    };

    // setTimeout(renderView, 2000);

    // Renders the 'balances' hash to index page
    // function renderView() {
    res.render('index', {
      title:'Tickers',
      tickers: indices,
      trigger: indices
    });
    // }
  }

  const renderMarket = (balances)=>{
    bittrex.getmarketsummaries( function( data, err ) {
      if (err) {
        return console.error(err);
      }
      market = data.result
      renderIndexs(balances,market)
    });
  }

  bittrex.getbalances(( data, err )=> {
    // Error handling
    if (err) {
      return console.error(err);
    }
    // Filter "balances" hash
    balances = data.result.filter((ticker)=> ticker.Balance > 0);
    // Call renderIndexs function
    renderMarket(balances);
  });

});


// Start Server
app.listen(3000, ()=> {
  console.log('Example app listening on port 3000!');
});
