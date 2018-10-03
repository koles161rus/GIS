import React from 'react';
import ol from 'openlayers';
import { bind } from 'app/utils';
import $ from 'jquery';

export default class AddVector extends React.Component {
  constructor ( props ) {
    super( props );

    bind( this,
      'onAddVector',
      'onNameInputChange',
      'onRedInputChange',
      'onGreenInputChange',
      'onBlueInputChange',
      'onAlphaInputChange',
      'onWidthInputChange',
      'onRadiusInputChange' );

    this.state = {
      NameInputValue: undefined,
      RedInputValue: undefined,
      GreenInputValue: undefined,
      BlueInputValue: undefined,
      AlphaInputValue: undefined,
      WidthInputValue: undefined,
      RadiusInputValue: undefined
    };
  }
  onNameInputChange( event ) {
    this.setState({ NameInputValue: event.target.value });
  }
  onRedInputChange( event ) {
    if( event.target.value < 256 ) {
      debugger;
      this.setState({ RedInputValue: event.target.value });
    } else {
      alert("ВНИМАНИЕ: Значение не должно превышать 255");
      this.setState({ RedInputValue: undefined })
    }
  }
  onGreenInputChange( event ) {
    if( event.target.value < 256 ) {
      this.setState({ GreenInputValue: event.target.value });
    } else {
      alert("ВНИМАНИЕ: Значение не должно превышать 255");
      this.setState({ GreenInputValue: undefined })
    }
  }
  onBlueInputChange( event ) {
    if( event.target.value < 256 ) {
      this.setState({ BlueInputValue: event.target.value });
    } else {
      alert("ВНИМАНИЕ: Значение не должно превышать 255");
      this.setState({ BlueInputValue: undefined })
    }
  }
  onAlphaInputChange( event ) {
    if( event.target.value < 101 ) {
      this.setState({ AlphaInputValue: event.target.value });
    } else {
      alert("ВНИМАНИЕ: Значение не должно превышать 100");
      this.setState({ BlueInputValue: undefined })
    }
  }
  onWidthInputChange( event ) {
    this.setState({ WidthInputValue: event.target.value });
  }
  onRadiusInputChange( event ) {
    this.setState({ RadiusInputValue: event.target.value });
  }
  onAddVector( event ) {
    $.ajax({
      url: '/layers/addvector/',
      method: 'POST',
      data: {
        name: this.state.NameInputValue || "Без названия",
        alpha: this.state.AlphaInputValue / 100 || "0.2",
        blue: this.state.BlueInputValue || "0",
        green: this.state.GreenInputValue || "127",
        radius: this.state.RadiusInputValue || "5",
        red: this.state.RedInputValue || "255",
        width: this.state.WidthInputValue || "2"
      },
      success: data => {
        this.props.addVector( data.id, 
          this.state.NameInputValue || "Без названия", 
          this.state.RedInputValue || "255", 
          this.state.GreenInputValue || "127", 
          this.state.BlueInputValue || "0", 
          this.state.AlphaInputValue / 100 || "0.2",
          this.state.WidthInputValue || "2", 
          this.state.RadiusInputValue|| "5" );
        console.log(data);
      },
      error: data => {
        debugger;
        if( this.state.NameInputValue.length > 255 ) {
          alert("ОШИБКА ДОБАВЛЕНИЯ: Слишком длинное название (макс. 256 знаков)")
        }
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
        placeholder="Без названия"
        style={{ 'margin':'0 0 5px 10px' }}
        onChange={NameInputValue => this.onNameInputChange(NameInputValue)}/>
      <h4 style={{ 'fontFamily':'arial', 'color':'white', 'width':'75px', 'display':'inline-block', 'margin':'0 0 0 10px' }}>
        RGBA:</h4>
      <h4 style={{ 'backgroundColor':'red', 'width':'10px', 'display':'inline-block', 'margin':'0 0 5px 10px' }}>&nbsp;</h4>
      <input 
        type="number"
        min="0"
        max="255"
        placeholder="255"
        style={{ 'margin':'0 0 5px 0', 'width':'40px' }}
        onChange={RedInputValue => this.onRedInputChange(RedInputValue)}/>
      <h4 style={{ 'backgroundColor':'green', 'width':'10px', 'display':'inline-block', 'margin':'0 0 5px 5px' }}>&nbsp;</h4>
      <input 
        type="number"
        min="0"
        max="255"
        placeholder="127"
        style={{ 'margin':'0 0 5px 0', 'width':'40px' }}
        onChange={GreenInputValue => this.onGreenInputChange(GreenInputValue)}/>
      <h4 style={{ 'backgroundColor':'blue', 'width':'10px', 'display':'inline-block', 'margin':'0 0 5px 5px' }}>&nbsp;</h4>
      <input 
        type="number"
        min="0"
        max="255"
        placeholder="0"
        style={{ 'margin':'0 0 5px 0', 'width':'40px' }}
        onChange={BlueInputValue => this.onBlueInputChange(BlueInputValue)}/>
      <h4 style={{ 'background':'linear-gradient(grey 1px, white 0)', 'backgroundSize':'100% 2px', 'width':'10px', 'display':'inline-block', 'margin':'0 0 5px 5px' }}>&nbsp;</h4>
      <input 
        type="number"
        min="0"
        max="100"
        placeholder="20"
        style={{ 'margin':'0 0 5px 0', 'width':'40px' }}
        onChange={AlphaInputValue => this.onAlphaInputChange(AlphaInputValue)}/>
      <h4 style={{ 'fontFamily':'arial', 'color':'white', 'display':'inline-block', 'margin':'0 0 0 2px' }}>
        %</h4>
      <h4 style={{ 'fontFamily':'arial', 'color':'white', 'width':'124px', 'display':'inline-block', 'margin':'0 0 0 10px' }}>
        Ширина линии:</h4>
      <input 
        type="number"
        min="0"
        max="10"
        placeholder="2"
        style={{ 'margin':'0 0 5px 5px', 'width':'30px' }}
        onChange={WidthInputValue => this.onWidthInputChange(WidthInputValue)}/>
      <h4 style={{ 'fontFamily':'arial', 'color':'white', 'width':'112px', 'display':'inline-block', 'margin':'0 0 0 16px' }}>
        Радиус точки:</h4>
      <input 
        type="number"
        min="0"
        max="50"
        placeholder="5"
        style={{ 'margin':'0 0 5px 5px', 'width':'30px' }}
        onChange={RadiusInputValue => this.onRadiusInputChange(RadiusInputValue)}/>
      <button 
        className="geometry-menu"
        style={{ 'width':'200px', 'display':'block' }}
        onClick={this.onAddVector}>
          Создать новый слой</button>
    </div>;
  }
}