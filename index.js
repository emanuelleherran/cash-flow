const form = document.getElementById('form-new-transaction')
const contentBalanceSheet = document.getElementById('content-balance-sheet')
let sumIncome = 0, sumExpense = 0, balance = 0

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
    removeEmptyState()
    createTablesBalanceSheet()
    renderTransaction(savedTransaction)
    sumTransactions(savedTransaction)
    renderBalance()
}

function createTablesBalanceSheet(){
    const table = document.getElementById('tables-balance-sheet')

    if(!table){
        const tablesBalanceSheet = document.createElement('div')
        tablesBalanceSheet.id = 'tables-balance-sheet'
        tablesBalanceSheet.className = 'tables-balance-sheet'
    
        contentBalanceSheet.appendChild(tablesBalanceSheet)
    
        const tableIncome = document.createElement('table')
        tableIncome.id = 'table-income'
        const tableExpense = document.createElement('table')
        tableExpense.id = 'table-expense'
    
        tablesBalanceSheet.append(tableIncome, tableExpense)
    
        const captionIncome = document.createElement('caption')
        captionIncome.innerText = 'Income'
        const captionExpense = document.createElement('caption')
        captionExpense.innerText = 'Expense'
        const tbodyIncome = document.createElement('tbody')
        const tbodyExpense = document.createElement('tbody')
        const trIncome = document.createElement('tr')
        const trExpense = document.createElement('tr')
    
        tableIncome.append(captionIncome, tbodyIncome)
        tableExpense.append(captionExpense, tbodyExpense)
    
        tbodyIncome.appendChild(trIncome)
        tbodyExpense.appendChild(trExpense)
    
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
}

function showEmptyState(){
    const emptyState = document.createElement('div')
    emptyState.id = 'empty-state'
    emptyState.className = 'empty-state'

    contentBalanceSheet.appendChild(emptyState)

    const contentImg = document.createElement('div')
    contentImg.className = 'content-img'

    const contentEmptyStatePhrase = document.createElement('div')
    contentEmptyStatePhrase.className = 'content-empty-state-phrase'

    emptyState.append(contentImg, contentEmptyStatePhrase)

    const img = document.createElement('img')
    img.src = '/img/emptyIcon.png'
    img.alt = 'empty-icon'

    contentImg.appendChild(img)

    const phrase = document.createElement('p')
    phrase.innerText = 'You need to add new transactions to see your balance sheet'

    contentEmptyStatePhrase.appendChild(phrase)
}

function removeEmptyState(){
    const emptyState = document.getElementById('empty-state')

    if(emptyState){
        contentBalanceSheet.removeChild(emptyState)
    }
}

function renderTransaction(transactionData){
    const option = transactionData.option
    const tableIncome = document.querySelector('#table-income tbody')
    const tableExpense = document.querySelector('#table-expense tbody')

    const trTransaction = document.createElement('tr')
    trTransaction.id = `transaction-${transactionData.id}`

    const date = document.createElement('td')
    date.innerText = transactionData.date

    const description = document.createElement('td')
    description.innerText = transactionData.description

    const amount = document.createElement('td')
    amount.innerText = transactionData.amount

    trTransaction.append(date, description, amount)

    if(option === "Income"){
        tableIncome.appendChild(trTransaction)
    }else{
        tableExpense.appendChild(trTransaction)
    }
}

function sumTransactions(transactionData){
    const option = transactionData.option
    const amount = parseFloat(transactionData.amount)

    if(option === "Income"){
        sumIncome += amount 
        balance += amount
    }else{
        sumExpense -= amount
        balance -= amount
    }
}

function renderBalance(){
    const incomeValue  = document.getElementById('income-value')
    const expenseValue = document.getElementById('expenses-value')
    const balanceValue = document.getElementById('balance-value')

    if(sumIncome > 0){
        incomeValue.innerText = `$ ${sumIncome}`
    }

    if(sumExpense < 0){
        expenseValue.innerText = `$ ${sumExpense}`
    }

    if(balance > 0){
        balanceValue.className = 'positive-value values'
    }else if(balance < 0){
        balanceValue.className = 'negative-value values'
    }

    balanceValue.innerText = `$ ${balance}`
}

async function fetchTransaction(){
    const transactions = await fetch("http://localhost:3000/transactions").then(res => res.json())
    if (Object.keys(transactions).length > 0){
        createTablesBalanceSheet()
        transactions.forEach(sumTransactions)
        renderBalance()
        transactions.forEach(renderTransaction)
    }else{
        showEmptyState()
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTransaction()
})