import React from 'react';
import { Component } from 'react';
import classnames from 'classnames';
import _ from 'underscore';
import cards from './cards.json';



import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            win: false
        }
    }

    resultMsg = (result) => {
        if (result) {
            this.setState({win: true})
        }
    };

      render() {
        return (
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">{this.state.win ? 'Congratulations!!! You are WINNER!!!' : 'Let start React Memory Game'}</h1>
            </header>
              <div className="game">
                    <Field winner={this.resultMsg}/>
              </div>
          </div>
        )
      }
}


class Field extends Component {
    constructor(props){
        super(props);
        this.state = {
            cards: cards,
            field: Array(16).fill(0),
            flippedCards: [],
            matched: null,
            hidden: true,
            clickable: true
        }
    }

    winner = () => {
        this.props.winner(true);
    };

    randomArr = () => {
        let cards = this.state.cards;
        function compare() {
          return Math.random()
        }
        cards.sort(compare);
    };

    resetGame = () => {
        this.setState({field: Array(16).fill(0)});
        this.randomArr();
    };

    showCards = () => {
        this.setState({hidden: false});
        setTimeout(() => {
            this.setState({
                hidden: true
            })
        }, 3000);
    };

    flipCard = (index) => {
        if (this.state.clickable) {
            let field = this.state.field;
        let flippedCards = this.state.flippedCards;
        if (field[index] === 0) {
            flippedCards.push(index);
            this.setState({
                flippedCards: flippedCards
            });
        }
        field[index] = 1;
        this.setState({field: field});
        if (flippedCards.length === 2) {
            this.setState({clickable: false});
            if (_.isEqual(cards[flippedCards[0]].name, cards[flippedCards[1]].name)) {
                let m = this.state.matched + 1;
                if (m === 8) {
                    this.winner();
                }
                this.setState({flippedCards: [],
                                  clickable: true,
                                    matched: m});
                } else {
                    flippedCards.map(item => {
                        setTimeout(() => {
                            field[item] = 0;
                            this.setState({
                                flippedCards: [],
                                       field: field,
                                   clickable: true
                            })
                        }, 1000);
                    });
                }
            }
        }
    };

        render() {
            return (
                <div className="game-field">
                    <div className="grid flex">
                        {
                            this.state.cards.map((card, index) => {
                                if (this.state.field[index] === 1) {
                                    return <Card key={card.id}
                                                 index={index}
                                                 name={card.name}
                                                 handleClick={this.flipCard}
                                                 hidden={false}>
                                           </Card>
                                } else {
                                    return <Card key={card.id}
                                                 index={index}
                                                 name={card.name}
                                                 handleClick={this.flipCard}
                                                 hidden={this.state.hidden}>
                                           </Card>
                                }
                            })
                        }
                    </div>
                    <div className="game-controls">
                        <Start showCards={this.showCards}/>
                        <Reset resetGame={this.resetGame}/>
                    </div>
                </div>
            );
        }
}

class Card extends Component {
    render () {
        let classes = classnames(
            'card-value',
            {'hidden': this.props.hidden}
        );
        return (
            <div className="card flex" onClick={() => this.props.handleClick(this.props.index, this.props.name)}>
                <span className={classes}>
                    {this.props.name}
                </span>
            </div>
        );
    }
}

class Start extends Component {
    render () {
        return (
            <button className="btn start-btn" onClick={this.props.showCards}>Start</button>
        )
    }
}

class Reset extends Component {
    render () {
        return (
            <button className="btn reset-btn" onClick={this.props.resetGame}>Reset</button>
        )
    }
}

export default App;
