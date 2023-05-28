const form = document.getElementById('form-new-transaction')
const contentBalanceSheet = document.getElementById('content-balance-sheet')
let sumIncome = 0, sumExpense = 0, balance = 0

form.addEventListener('submit', createNewTransaction)

contentBalanceSheet.addEventListener('click', function(e){
    if(e.target.className === 'edit-icon-img'){
        editingTransaction(e.target.id)
    }else if(e.target.className === 'delete-icon-img'){
        deleteTransaction(e.target.id)
    }
})

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

async function deleteTransaction(transactionId){
    console.log(transactionId)
    const splitId = transactionId.split('-')
    const id = splitId[splitId.length-1]

    console.log(splitId)
    console.log(id)
    await fetch(`http://localhost:3000/transactions/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())

    location.reload(false)
}

function editingTransaction(transactionId){
    const transaction = document.getElementById(transactionId).parentNode.parentNode
    const editImgElement = document.getElementById(transactionId)
    const deleteImgElement = transaction.querySelector('.delete-icon-img')
    const savedDateElement = transaction.querySelector('.saved-date')
    const savedDescriptionElement = transaction.querySelector('.saved-description')
    const savedAmountElement = transaction.querySelector('.saved-amount')

    const editDateInput = document.createElement('input')
    editDateInput.type = 'date'
    editDateInput.value = savedDateElement.innerText
    savedDateElement.innerText = ''

    const editDescriptionInput = document.createElement('input')
    editDescriptionInput.type = 'text'
    editDescriptionInput.value = savedDescriptionElement.innerText
    savedDescriptionElement.innerText = ''

    const editAmountInput = document.createElement('input')
    editAmountInput.type = 'text'
    editAmountInput.value = savedAmountElement.innerText
    savedAmountElement.innerText = ''

    savedDateElement.appendChild(editDateInput)
    savedDescriptionElement.appendChild(editDescriptionInput)
    savedAmountElement.appendChild(editAmountInput)

    editImgElement.src = '/img/verificar.png'
    deleteImgElement.src = '/img/cancelar.png'

    const splitId = transaction.id.split('-')
    const idTransaction = splitId[splitId.length-1]

    editImgElement.addEventListener('click', function(){
        updateTransaction(idTransaction, transaction)
    })
    deleteImgElement.addEventListener('click', function(){
        cancelChange(idTransaction, transaction)
    })
}

async function getTransaction(id){
    const transaction = await fetch(`http://localhost:3000/transactions/${id}`).then(res => res.json())
    return transaction
}

async function updateTransaction(id, element){
    let op = ''

    const editImgElement = element.querySelector('.edit-icon-img')
    const deleteImgElement = element.querySelector('.delete-icon-img')
    const savedDateInput = element.querySelector('.saved-date input')
    const savedDescriptionInput = element.querySelector('.saved-description input')
    const savedAmountInput = element.querySelector('.saved-amount input')
    const savedDateElement = element.querySelector('.saved-date')
    const savedDescriptionElement = element.querySelector('.saved-description')
    const savedAmountElement = element.querySelector('.saved-amount')

    if(element.className === 'incomeTr'){
        op = "Income"
    }else{
        op = "Expense"
    }

    const transactionData = {
        option: op,
        date: savedDateInput.value,
        description: savedDescriptionInput.value,
        amount: savedAmountInput.value
    }

    const response = await fetch(`http://localhost:3000/transactions/${id}`, {
         method: 'PUT',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(transactionData)
    }).then(res => res.json())

    savedDateElement.removeChild
    savedDateElement.innerText = response.date

    savedDescriptionElement.removeChild
    savedDescriptionElement.innerText = response.description

    savedAmountElement.removeChild
    savedAmountElement.innerText = response.amount

    editImgElement.src = '/img/editar-texto.png'
    deleteImgElement.src = '/img/excluir.png'

    location.reload(false)
}

async function cancelChange(id, element){
    const transaction = await getTransaction(id)

    //TODO create function to stop duplicate this code
    const editImgElement = element.querySelector('.edit-icon-img')
    const deleteImgElement = element.querySelector('.delete-icon-img')
    const savedDateElement = element.querySelector('.saved-date')
    const savedDescriptionElement = element.querySelector('.saved-description')
    const savedAmountElement = element.querySelector('.saved-amount')

    savedDateElement.removeChild
    savedDateElement.innerText = transaction.date

    savedDescriptionElement.removeChild
    savedDescriptionElement.innerText = transaction.description

    savedAmountElement.removeChild
    savedAmountElement.innerText = transaction.amount

    editImgElement.src = '/img/editar-texto.png'
    deleteImgElement.src = '/img/excluir.png'
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
    date.className = 'saved-date'

    const description = document.createElement('td')
    description.innerText = transactionData.description
    description.className = 'saved-description'

    const amount = document.createElement('td')
    amount.innerText = transactionData.amount
    amount.className = 'saved-amount'

    const editIcon = document.createElement('td')
    editIcon.className = 'button-1'

    const deleteIcon = document.createElement('td')
    deleteIcon.className = 'button-2'

    trTransaction.append(date, description, amount, editIcon, deleteIcon)

    const editIconImg = document.createElement('img')
    editIconImg.className = 'edit-icon-img'
    editIconImg.id = `edit-transaction-${transactionData.id}`
    editIconImg.src = '/img/editar-texto.png'

    const deteleIconImg = document.createElement('img')
    deteleIconImg.className = 'delete-icon-img'
    deteleIconImg.id = `delete-transaction-${transactionData.id}`
    deteleIconImg.src = '/img/excluir.png'

    editIcon.appendChild(editIconImg)
    deleteIcon.appendChild(deteleIconImg)

    if(option === "Income"){
        trTransaction.className = 'incomeTr'
        tableIncome.appendChild(trTransaction)
    }else{
        trTransaction.className = 'expenseTr'
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
        transactions.forEach(renderTransaction)
        transactions.forEach(sumTransactions)
        renderBalance()
    }else{
        showEmptyState()
    }
}

document.addEventListener('DOMContentLoaded', () => {
     fetchTransaction()
})