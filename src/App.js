import React from 'react';
import styled from 'styled-components';
import Spells from './spells';

const color = {
    bard: '#E052E0',
    cleric: '#EB4747',
    druid: '#60DF20',
    paladin: '#F5D63D',
    ranger: '#2EB82E',
    sorcerer: '#F2800D',
    warlock: '#A852FF',
    wizard: '#4C88FF'
}

/* Parsing a Google Sheets JSON */

/*const casterTypes = ['Bard', 'Ranger', 'Druid', 'Cleric', 'Paladin', 'Warlock', 'Sorcerer', 'Wizard'];

var coordX = 1;
var coordY = 1;

for (var currentKey in Spells) {

    Spells[currentKey]['id'] = currentKey;
    Spells[currentKey]['casters'] = [];
    Spells[currentKey]['additionalCasters'] = [];
    Spells[currentKey]['coordinates'] = [coordX, coordY];
    if (++coordX > 19) {
        coordX = 1;
        coordY++;
    }

    for (var casterType of casterTypes) {
        if (Spells[currentKey]['caster' + casterType] === casterType) {
            Spells[currentKey]['casters'].push(casterType.toLowerCase());
        } else if (Spells[currentKey]['caster' + casterType]) {
            Spells[currentKey]['additionalCasters'].push(casterType.toLowerCase());
        }
    }

    //console.log(Spells[currentKey]);
}*/

// end json import

function gradientize(casters) {
    let gradient = 'background: conic-gradient(';
    let position = 0;
    let step = 100/casters.length;
    for (let caster of casters) {
        if (position) {
            gradient += ', ';
        }
        gradient += color[caster] + ' ' + position + '% ' + (position += step) + '%';
    }
    gradient += ');';
    return gradient;
}

const Board = styled.div`
    display: grid;
    grid-template-columns: repeat(19, 1fr);
    grid-gap: 0.75vw;
    margin: 0.75vw;
    @media only screen and (min-width: 1280px) {
        width: calc(1280px - 1.5 * 12.8px);
        grid-gap: calc(0.75 * 12.8px);
        margin: calc(0.75 * 12.8px) auto;
    }
`;

function AdditionalCaster(props) {

    return (
        <div className={props.className}></div>
    );
}

const StyledAdditionalCaster = styled(AdditionalCaster)`
    position: absolute;
    width: 1vw;
    height: 1vw;
    border-radius: 50%;
    box-shadow: 0 0 0 3px #222;
    background-color: ${props => color[props.caster]};

    :first-of-type {
        top: 0;
        left: 0;
    }

    :nth-of-type(2) {
        top: 0;
        right: 0;
    }

    @media only screen and (min-width: 1280px) {
        width: 12.8px;
        height: 12.8px;
    }
`;

const CasterLabel = styled.span`
    color: ${props => color[props.caster]};
    text-transform: capitalize;

    :not(:last-of-type) {
        :after {
            content: ', ';
        }
    }
`;

class SpellTooltip extends React.Component {

    renderCasterLabels(casters) {

        return casters.map(caster => <CasterLabel caster={caster}>{caster}</CasterLabel>);
    }

    render() {

        return(
            <div className={this.props.className}>
                <h3>{this.props.name}</h3>
                <h4>{this.props.level ? 'LEVEL' + this.props.level : 'CANTRIP'}</h4>
                <p>{this.renderCasterLabels(this.props.casters)}{this.props.additionalCasters.length > 0 ? ' and subclasses of ' : ''}{this.renderCasterLabels(this.props.additionalCasters)}</p>
            </div>
        );
    }
}

const StyledSpellTooltip = styled(SpellTooltip)`
    opacity: 0;
    visibility: hidden;
    display: block;
    position: absolute;
    min-width: 10em;
    top: 110%;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background-color: #111;
    color: #aaa;
    font-size: 0.75em;
    line-height: 1.3;
    padding: 0.75em;
    transition: opacity 0.15s, transform 0.15s;
    box-shadow: 0 0 1em 0 rgba(0,0,0,0.25);

    :before {
        content: '';
        position: absolute;
        left: calc(50% - 5px);
        top: -5px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 5px 5px 5px;
        border-color: transparent transparent #111 transparent;
    }

    h3, h4, p {
        margin: 0;
    }

    h3 {
        color: #fff;
        white-space: nowrap;
    }

    h4 {
        border-bottom: 1px solid #333;
        padding-bottom: 0.5em;
        margin-bottom: 0.25em;
    }
`;

function Spell(props) {

    function renderAdditionalCasters(props) {
        if (props.additionalCasters) {

            return props.additionalCasters.map(additionalCaster => <StyledAdditionalCaster caster={additionalCaster}/>);
        } else {

            return '';
        }
    }

    return (
        <div className={props.className} onClick={() => props.onClick()}>
            {renderAdditionalCasters(props)}
            <SpellLevel></SpellLevel>
            <StyledSpellTooltip name={props.name} level={props.level} casters={props.casters} additionalCasters={props.additionalCasters} />
        </div>
    );
}

const StyledSpell = styled(Spell)`
    width: 100%;
    padding-top: 100%;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    ${props => gradientize(props.casters)}
    ${props => props.coordinates ? 'grid-column-start: ' + props.coordinates[0] + ';' : ''}
    ${props => props.coordinates ? 'grid-row-start: ' + props.coordinates[1] + ';' : ''}
    ${props => props.highlight ? 'box-shadow: 0 0 0 3px #222, 0 0 0 6px ' + color[props.highlight] : ';'}
    ${props => props.selected ? 'box-shadow: 0 0 0 3px #fff' : ';'}
    ${props => props.selected ? 'z-index: 2;' : ''}
    ${props => (props.hasOpacity || props.highlight || props.selected) ? '' : 'opacity: 0.5;'}

    :hover {
        ${props => props.selected ? 'box-shadow: 0 0 0 3px #fff;' : 'box-shadow: 0 0 0 3px rgba(255,255,255,0.5);'}
        opacity: 1;
        z-index: 2;

        ${StyledSpellTooltip} {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }
    }
`;

const SpellLevel = styled.div`
    position: absolute;
    top: calc(50% - 0.75vw);
    left: 0;
    right: 0;
    font-size: 1.5vw;
    line-height: 1.5vw;
    text-align: center;

    @media only screen and (min-width: 1280px) {
        top: calc(50% - 0.75 * 12.8px);
        font-size: calc(1.5 * 12.8px);
        line-height: calc(1.5 * 12.8px);
    }
`;

function SaveButton(props) {

    return <button onClick={() => props.onClick()}>Save</button>;
}

function HighlightButton(props) {

    return <button onClick={() => props.onClick()}>{props.label}</button>;
}

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            'spells': [],
            'selectedId': false,
            'highlightedClass': false,
            'autosaving': false,
            'timeSinceLastSave': 0
        };

        var currentKey=0;
        for (currentKey in Spells) {
            this.state.spells[currentKey] = Spells[currentKey];
            console.log(this.state.spells[currentKey]);
        }

        this.state.selectedId = false;
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        if (this.state.autosaving) {
            this.setState({
                'timeSinceLastSave': this.state['timeSinceLastSave'] + 1000
            });
            if (this.state['timeSinceLastSave'] > 300000) {
                this.handleSave(this.state.spells);
                this.setState({
                    'timeSinceLastSave': 0
                });
                console.log('Saved');
            }
        }
    }

    handleSave(jsonData) {
        const fileData = JSON.stringify(jsonData);
        const blob = new Blob([fileData], {type: "text/plain"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'filename.json';
        link.href = url;
        link.click();
    }

    handleClick(i) {
        if (this.state.selectedId === i) {
            this.setState({'selectedId': false});
            console.log('unselected: '+i);
        } else if (this.state.selectedId) {
            console.log('switching position of ' + this.state.selectedId + ' and ' + i);
            var newCoords = this.state.spells[i]['coordinates'];
            this.state.spells[i]['coordinates'] = this.state.spells[this.state.selectedId]['coordinates'];
            this.state.spells[this.state.selectedId]['coordinates'] = newCoords;
            this.setState({'selectedId': false});
        } else {
            this.setState({'selectedId': i});
            console.log('selected: ' + i);
        }
    }

    handleHighlightClick(caster) {
        var newHighlightedClass = (this.state.highlightedClass === caster) ? false : caster;
        this.setState({highlightedClass: newHighlightedClass});
    }

    renderSpell(i) {
        //console.log(this.state.highlightedIds);
        //console.log(this.state.highlightedIds.includes(this.state.spells[i]['id']) ? ' contains ' : 'does not contain ')
        //console.log(this.state.spells[i]['id']);

        return (
            <StyledSpell
                id={this.state.spells[i]['id']}
                name={this.state.spells[i].name}
                casters={this.state.spells[i]['casters']}
                additionalCasters={this.state.spells[i]['additionalCasters']}
                level={this.state.spells[i]['level']}
                selected={this.state.selectedId === i ? true : false}
                hasOpacity={!this.state.highlightedClass}
                highlight={this.state.spells[i]['casters'].includes(this.state.highlightedClass) ? this.state.highlightedClass : false}
                coordinates={this.state.spells[i]['coordinates']}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    renderSpells() {
        var spells = [];

        for (var i in this.state.spells) {
            spells.push(this.renderSpell(i));
            //console.log(i);
        }

        return spells;
    }

    render() {
        return (
            <>
                <Board>
                    {this.renderSpells()}
                </Board>
                <SaveButton onClick={() => this.handleSave(this.state.spells)} />
                <HighlightButton onClick={() => this.handleHighlightClick('bard')} label='Highlight Bard' />
                <HighlightButton onClick={() => this.handleHighlightClick('cleric')} label='Highlight Cleric' />
                <HighlightButton onClick={() => this.handleHighlightClick('druid')} label='Highlight Druid' />
                <HighlightButton onClick={() => this.handleHighlightClick('paladin')} label='Highlight Paladin' />
                <HighlightButton onClick={() => this.handleHighlightClick('ranger')} label='Highlight Ranger' />
                <HighlightButton onClick={() => this.handleHighlightClick('sorcerer')} label='Highlight Sorcerer' />
                <HighlightButton onClick={() => this.handleHighlightClick('warlock')} label='Highlight Warlock' />
                <HighlightButton onClick={() => this.handleHighlightClick('wizard')} label='Highlight Wizard' />
                <p>{this.state.autosaving ? 'Autosave is on' : 'Autosave is OFF!!'}</p>
            </>
        );
    }
}

export default App;
