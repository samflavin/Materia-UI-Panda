import React, {Component} from 'react';
import './App.css';
import axios from 'axios';
class App extends Component {

state = {
  inventoryList:[],
  newItem: {
    name:'',
    quantity: '',
    measure: ''
  }
}

// Happens when the component is first loaded
//Runs when the component is first put on the DOM
componentDidMount() {
  this.getInventory();
}

handleSubmit = (event) => {
  event.preventDefault();
  console.log('hit submit', this.state.newItem);
  this.addInventoryItem();

}

handleChangeFor = (event, propertyName) => {
  console.log(`changing, ${propertyName}`);
  this.setState({
    newItem: {
      ...this.state.newItem,
      [propertyName]: event.target.value
    }
  })
}

addInventoryItem = () => {
  axios.post('/inventory', this.state.newItem)
  .then(response => {
    console.log('got inventory');
    this.getInventory();
  }).catch(response =>{
    alert('could not get inventory, sorry try agin later')

  })

}

getInventory = () => {
  axios.get('/inventory')
  .then( response =>{
    this.setState({
      inventoryList: response.data
    })
  })
  .catch( error => {
    alert( 'Couldnt get inventory, try again later!')
  })
}

deleteInventory = (item) => {
  axios.delete(`/inventory/${item.id}`)

.then( response => { 
console.log(response)
  this.getInventory();
}).catch(err => {
console.log('errir with delete', err)

})
}



changeQuantity = ( item, direction ) => {
  let newCount = item.quantity;
  if (direction === 'up'){
    newCount +=1;
  } else if (direction === 'down'){
    newCount -= 1;
  } else {
    console.log('need to pass direciton up or down')
  }
  axios.put(`/inventory/quantity/${item.id}`, {quantity: newCount} )
  .then( response => {
    console.log(response)
    this.getInventory();
  }).catch( error => {
    alert('Couldnt update inventory count, try again later!')
    console.log('error', error)
  })

}

render() {
  return (
    <> 
    <header><h1>Welcome to Panda Pantry</h1></header>
    <main>
      <section> 
        <h2>Add Item to the Pantry</h2>
        <form onSubmit={this.handleSubmit}>
          <label>Name:</label>
          <input type="text" name="name" onChange={(event) => this.handleChangeFor(event, 'name')}/>
          <label>Quantity:</label>
            <input type="number" name="quantity" onChange={(event) => this.handleChangeFor(event, 'quantity')}/>
          <label>Measure:</label>
            <input type="text" name="measure" onChange={(event) => this.handleChangeFor(event, 'measure')}/>
          <button type="reset">Cancel</button>
          <button type="submit">Save</button>
        </form>
      </section>
      <section>
        <h2>Pantry Contents</h2>
        <table>
          <thead>
            <tr>
              <th>Food Item</th>
              <th>Quantity</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {this.state.inventoryList.map(item =>
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity} {item.measure}</td>
                <td><button onClick={ ()=>this.changeQuantity(item, 'up')}>
                  Add 1 to Qty
                </button>
                <button onClick={() => this.changeQuantity(item, 'down')}>
                  Subtract 1 to Qty
                </button>
                <button onClick={()=> this.deleteInventory(item) }>delete</button>
                </td>
              </tr>
              )}
          </tbody>
        </table>
      </section>
    </main>
    </>
  );
}
}
export default App;
