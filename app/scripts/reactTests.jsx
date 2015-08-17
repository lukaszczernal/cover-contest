var App = React.createClass({
  render: function() {
    return (<Flip></Flip>)
  }
});

var Flip = React.createClass({
  render: function() {
    return (<div className="hexaflipWrapper">
              <div id="hexaflip-demo4" className="demo"></div>
            </div>
          )
  },
  componentDidMount: function () {
    var hexaDemo4,
        images = [
            './images/1.jpg',
            './images/2.jpg',
            './images/3.jpg',
            './images/4.jpg',
            './images/5.jpg',
            './images/6.jpg'
        ];

    new HexaFlip(document.getElementById('hexaflip-demo4'), {set: images},{size: 500});

    // document.getElementById('prev').addEventListener('click', function(){
    //     hexaDemo4.flipBack();
    // }, false);

    // document.getElementById('next').addEventListener('click', function(){
    //     hexaDemo4.flip();
    // }, false);

  },

});

React.render(<App />, document.body);
