const { Map: LeafletMap, TileLayer, Marker, Popup } = window.ReactLeaflet

class App extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         message: [],
         id: 0
      };
      this.createMessage = this.createMessage.bind(this);
      this.deleteMessage = this.deleteMessage.bind(this);
      this.getPositon = this.getPositon.bind(this);
   }

   UNSAFE_componentWillMount = async () => {
      let obj = await fetch("http://localhost:8080/Map/messages").then(r => r.json());
      await this.setState({ message: obj.message });
      let lenght = this.state.message[this.state.message.length - 1].id + 1
      this.setState({ id: lenght })
   }

   createMessage = (e) => {
      if (this.messageElement.value !== "" && this.LatElement.value !== "" && this.LonElement.value !== "") {
         let newMessage = {
            id: this.state.id,
            content: this.messageElement.value,
            lat: this.LatElement.value,
            lon: this.LonElement.value
         };

         fetch("http://localhost:8080/Map/messages", {
            method: 'POST',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMessage)
         }).then((res) => res.json())
         e.preventDefault()

         this.LonElement.value = ""
         this.LatElement.value = ""
         this.messageElement.value = ""

         this.setState({ id: this.state.id + 1 })

         this.setState((prevState) => {
            return { message: prevState.message.concat(newMessage) };
         });
      }
      this.LonElement.value = ""
      this.LatElement.value = ""
      this.messageElement.value = ""
      e.preventDefault()
   }

   deleteMessage = (id) => {
      fetch("http://localhost:8080/Map/messages?id=" + id, {
         method: 'DELETE',
      })

      let filtered = this.state.message.filter((mes) => {
         return (mes.id !== id)
      })

      this.setState({ message: filtered })
   }

   getPositon = (e) => {
      this.LonElement.value = e.latlng.lng
      this.LatElement.value = e.latlng.lat
   }

   render() {
      const position = [45.51, 10.2]
      return (
         <div>
            <h1> The GuestMap </h1>
            <div className="container">
               <div className="row">
                  <div className="col-9">
                     <LeafletMap center={position} zoom={5} onClick={this.getPositon}>
                        <TileLayer
                           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Message message={this.state.message} delete={this.deleteMessage} />
                     </LeafletMap>
                  </div>
                  <div className="col-3 form">
                     <h5>Add new message into the Map</h5>
                     <p className="text">Before you must select a point on the map where you want to create the message</p>
                     <form onSubmit={this.createMessage}>
                        <input className="input" ref={(obj) => this.LonElement = obj} type="text" placeholder="Latitude" disabled></input>
                        <input className="input" ref={(obj) => this.LatElement = obj} type="text" placeholder="Longitude" disabled></input>
                        <input className="input" ref={(obj) => this.messageElement = obj} type="text" placeholder="Add a new message..."></input>
                        <br></br>
                        <button className="button" type="submit">Add</button>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      )
   }
}


