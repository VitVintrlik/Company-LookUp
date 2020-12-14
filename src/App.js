import React from "react";
import './App.css';
import './materialStyles.css';
import './table.css';
import axios from "axios";
import ReactDOM from "react-dom";

//Cesta k php skriptu ktery ma nastarost volani spravne funkce momentalne je tohle cesta k memu serveru.

//const API_PATH = 'http://localhost/pohovor/untitled/src/handler.php';

const API_PATH = 'http://ctecka.eu/backend/handler.php';

class SearchCompany extends React.Component {
    companyInfo = {
        city: null,
        ico: null,
        dic: null,
        name: null,
        street: null
    }

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            ico: '',
            renderTable: false
        }
    }

    setCompanyInfo(responseData) {
        this.companyInfo.city = responseData.aresCity;
        this.companyInfo.ico = responseData.aresIco;
        this.companyInfo.dic = responseData.aresDic;
        this.companyInfo.name = responseData.aresCompany;
        this.companyInfo.street = responseData.aresStreet;

    }

    /** Metoda se zavola pri odeslani formulare odesle zadane ico a akci get data, podle toho atributu
     * bude php skript vedet jakou funkci zavolat. Dale skontroluje stav odpovedi a zavola prislusnou metodu
     * @param event
     */
    handleSubmit = event => {
        event.preventDefault();
        console.log(this.state);
        axios.post(`${API_PATH}`, {ico: this.state.ico, action: "getData"}
        ).then(response => {
            console.log(response.data);
            if (response.data.state === 1) {
                document.getElementById("errorMessage").style.visibility = "hidden"
                this.setCompanyInfo(response.data);
                this.resultTable();
            } else {
                this.showErrorMessage(response.data)
            }

        }).catch(error => console.log(error));

    }

    /** Metoda se zavola pri kliknuti na lacitko ulozit odesle data z tabulkz a akci get data, podle toho atributu
     * bude php skript vedet jakou funkci zavolat. Dale skontroluje stav odpovedi a zavola prislusnou metodu
     */
    saveToDb = () => {
        axios.post(`${API_PATH}`, {info: this.companyInfo, action: "saveToDb"}
        ).then(response => {
            if (response.data.state === 1) {
                this.showSuccess()
            } else {
                this.showErrorMessage(response.data.fault)
            }
        }).catch(error => console.log(error));
    }

    showSuccess = () => {
        let errorContainer = document.getElementById("errorMessage")
        errorContainer.style.visibility = "visible"
        const message = (<span id="success"> Záznam úspěšně vytvořen</span>)
        ReactDOM.render(message, errorContainer)
    }

    showErrorMessage = stateFault => {
        let errorContainer = document.getElementById("errorMessage")
        errorContainer.style.visibility = "visible"
        let message = null
        if (stateFault === "icoFault") {
            message = (<span id="error"> IČO firmy nebylo nalezeno</span>)
        } else if (stateFault === "dbFault") {
            message = (<span id="error">Databáze ARES není dostupná</span>)
        } else if (stateFault === "isInDb") {
            message = (<span id="error">Záznam již existuje</span>)
        } else if (stateFault === "err") {
            message = (<span id="error">Požadavek se nezdařil</span>)
        }

        ReactDOM.render(message, errorContainer)
    }
    /** Skontroluje pomoci regexu zda se v fieldu nachazi pouze cisla nebo ne a ukaze chybove hlaseni
     * @param value momentalni honota input fieldu ico
     */

    validateInput = value => {
        const errorSpan = document.getElementById("errorInput")
        const NUMBER_REGEX = /^[0-9]+$/;
        if (!NUMBER_REGEX.test(value)) {
            errorSpan.style.visibility = "visible"
        } else {
            errorSpan.style.visibility = "hidden"
        }
    }

    /** Vyrederuje tabulku s vysledky z ARESu nebo z databaze
     */
    resultTable = () => {
        const table = (
            <>
                <table id="companyTable" className="companyTable">
                    <thead>
                    <tr>
                        <th>Nazev firmy</th>
                        <th>IČO</th>
                        <th>DIČ</th>
                        <th>Sídlo firmy</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{this.companyInfo.name}</td>
                        <td>{this.companyInfo.ico}</td>
                        <td>{this.companyInfo.dic}</td>
                        <td>{this.companyInfo.city}</td>
                    </tr>
                    </tbody>
                </table>
                <button id="saveToDbButton" className="materialButton" onClick={this.saveToDb.bind()}>Uložit zaznam
                </button>
            </>
        )
        ReactDOM.render(table, document.getElementById("tableContainer"))
    }

    render() {
        return (
            <>
                <div className="container">
                    <h2>Vyhledávání firmy</h2>
                    <form id="lookUp">
                        <div className="group">
                            <input type="text" id="companyName" value={this.state.name}
                                   onChange={e => this.setState({name: e.target.value})} required/>
                            <span className="highlight"/>
                            <span className="bar"/>
                            <label>Název firmy</label>
                        </div>
                        <div className="group">
                            <input type="text" id="companyICO" value={this.state.ico}
                                   onChange={e => {
                                       this.setState({ico: e.target.value});
                                       this.validateInput(e.target.value)
                                   }} required/>
                            <span className="highlight"/>
                            <span className="bar"/>
                            <label>IČO</label>
                            <span id="errorInput">Prosím zadejte pouze čísla</span>
                        </div>
                        <button id="searchCompanyButton" className="materialButton"
                                onClick={event => this.handleSubmit(event)}>Vyhledat
                        </button>
                    </form>
                    <div id="errorMessage"/>
                </div>
                <div id="tableContainer"/>
            </>
        )
    }


}

export default SearchCompany;
