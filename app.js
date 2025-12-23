const balanceEl = document.querySelector("#balance");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const transactionListEl = document.querySelector("#transaction-list");
const transactionFormEl = document.querySelector("#transaction-form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit",addTransaction);

function addTransaction(e){
    e.preventDefault();
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    if(!description || !amount){
        return;
    }
    const obj = {
        id:Date.now(),
        desc:description,
        amount:amount
    }
    transactions.push(obj);
    localStorage.setItem("transactions",JSON.stringify(transactions));
    updateTransactionList(obj);
    updateSummary();
    transactionFormEl.reset();
}

function updateTransactionList(obj){
    const li = document.createElement("li");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    const btn = document.createElement("button");
    p1.innerText = obj.desc;
    p2.innerText = obj.amount+".00₹";
    if (obj.amount > 0){
        p2.innerText = "+"+p2.innerText;
        p2.classList.add("income-text");
    }
    else if(obj.amount < 0){
        p2.classList.add("expense-text");
    }
    btn.innerText = "X";
    li.append(p1,p2,btn);
    transactionListEl.prepend(li);
    // console.log(transactionListEl);
    btn.addEventListener("click",()=>{
        li.remove();
        removefromStorage(obj.id);
        updateSummary();
    });
}

function removefromStorage(id){
    transactions = transactions.filter((obj)=>{
        return obj.id !== id;
    });
    localStorage.setItem("transactions",JSON.stringify(transactions));
}

function updateSummary(){
    const balance = transactions.reduce((a,obj)=>{
        return a + obj.amount;
    },0);
    const incomeArr = transactions.filter((obj)=>{
        return obj.amount>0;
    });
    const income = incomeArr.reduce((a,obj)=>{
        return a + obj.amount;
    },0);
    const expenseArray = transactions.filter((obj)=>{
        return obj.amount<0;
    });
    const expense = expenseArray.reduce((a,obj)=>{
        return a + obj.amount;
    },0);
    balanceEl.classList.remove("income-text","expense-text");
    
    incomeEl.innerText = "+₹" + income + ".00";
    expenseEl.innerText = "-₹" + Math.abs(expense) + ".00";
    if(balance > 0){
        balanceEl.classList.add("income-text");
        balanceEl.innerText = "+₹"+Math.abs(balance)+".00";
    }
    else if(balance < 0){
        balanceEl.classList.add("expense-text");
        balanceEl.innerText = "-₹"+Math.abs(balance)+".00";
    }
    else{
        balanceEl.innerText = "₹0.00";
    }
}
transactions.forEach(obj => {
    updateTransactionList(obj);
});
updateSummary();