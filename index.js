const form = document.getElementById('form-new-transaction')
const containerBalanceSheet = document.getElementById('container-balance-sheet')

form.addEventListener('submit', createNewTransaction)

async function createNewTransaction(ev){
    ev.preventDefault()

    const transactionData = {
        option: document.querySelector('input[name="option"]:checked').value,
        date: document.querySelector('#date').value,
        description: document.querySelector('#description').value,
        amount: document.querySelector('#amount').value
    }

    const response = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
    })

    const savedTransaction = await response.json()
    form.reset()
    
    console.log(savedTransaction)
}

function createTablesBalanceSheet(){
    const tablesBalanceSheet = document.createElement('div')
    tablesBalanceSheet.id = 'tables-balance-sheet'
    tablesBalanceSheet.className = 'tables-balance-sheet'

    containerBalanceSheet.appendChild(tablesBalanceSheet)

    const tableIncome = document.createElement('table')
    const tableExpense = document.createElement('table')

    tablesBalanceSheet.append(tableIncome, tableExpense)

    const captionIncome = document.createElement('caption')
    captionIncome.innerText = 'Income'
    const captionExpense = document.createElement('caption')
    captionExpense.innerText = 'Expense'
    const trIncome = document.createElement('tr')
    const trExpense = document.createElement('tr')

    tableIncome.append(captionIncome, trIncome)
    tableExpense.append(captionExpense, trExpense)

    const thDateI = document.createElement('th')
    thDateI.className = 'side-collum'
    thDateI.innerText = 'Date'

    const thDescriptionI = document.createElement('th')
    thDescriptionI.className = 'central-collum'
    thDescriptionI.innerText = 'Description'

    const thAmountI = document.createElement('th')
    thAmountI.className = 'side-collum'
    thAmountI.innerText = 'Amount'

    const thDateE = document.createElement('th')
    thDateE.className = 'side-collum'
    thDateE.innerText = 'Date'

    const thDescriptionE = document.createElement('th')
    thDescriptionE.className = 'central-collum'
    thDescriptionE.innerText = 'Description'

    const thAmountE = document.createElement('th')
    thAmountE.className = 'side-collum'
    thAmountE.innerText = 'Amount'

    trIncome.append(thDateI, thDescriptionI, thAmountI)
    trExpense.append(thDateE, thDescriptionE, thAmountE)
}

function renderTransaction(transactionData){
    
}

createTablesBalanceSheet()