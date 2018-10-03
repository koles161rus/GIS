import React from 'react';
import ol from 'openlayers';
import { bind } from 'app/utils';
import $ from 'jquery';

export default class AddTiles extends React.Component {
  constructor ( props ) {
    super( props );

    bind( this, 'onClickButton' );

    this.state = {
      NameInputValue: undefined,
      URLInputValue: undefined
    };
  }
  onNameInputChange( event ) {
    this.setState({ NameInputValue: event.target.value });
  }
  onURLInputChange( event ) {
    this.setState({ URLInputValue: event.target.value });
  }
  onClickButton( event ) {
    $.ajax({
      url: '/layers/tiles/',
      method: 'POST',
      data: {
        name: this.state.NameInputValue || "Без Названия",
        url: this.state.URLInputValue || "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      },
      success: data => {
        this.props.addLayer( data.id, 
          this.state.NameInputValue || "Без Названия", 
          this.state.URLInputValue || "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png" );
        console.log(data);
      },
      error: function(data) {
        //$('body').html(data.responseText);
        alert("ОШИБКА ДОБАВЛЕНИЯ: Слишком длинное название или url (макс. 256 знаков)");
      }
    });
  }
  render() {
    return <div>
      <h4 style={{ 'fontFamily':'arial', 'color':'white', 'width':'75px', 'display':'inline-block', 'margin':'0 0 0 10px' }}>
        Название:</h4>
      <input
        type="text"
        size="28"
        placeholder="Без Названия"
        style={{ 'margin':'0 0 5px 10px' }}
        onChange={NameInputValue => this.onNameInputChange(NameInputValue)}/>
      <h4 style={{ 'fontFamily':'arial', 'color':'white', 'width':'75px', 'display':'inline-block', 'margin':'0 0 0 10px' }}>
        URL:</h4>
      <input 
        type="text"
        size="28"
        placeholder="https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        style={{ 'margin':'0 0 5px 10px' }}
        onChange={URLInputValue => this.onURLInputChange(URLInputValue)}/>
      <button 
        className="geometry-menu"
        style={{ 'width':'200px', 'display':'block' }}
        onClick={this.onClickButton}>
          Создать новый слой</button>
    </div>;
  }
}