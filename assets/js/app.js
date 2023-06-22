const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const saveButton = document.querySelector(".save");
const tumunuTemizle = document.querySelector("#clear-all");
const ul = document.querySelector(".recorded");
const form = document.querySelector(".task");
const cardBody = document.querySelector(".card-body");
const arama = document.querySelector("#nameSearch");

let liste = [];

runEvents();
function runEvents() {
    form.addEventListener("submit", addList);
    ul.addEventListener("click", removeList); 
    tumunuTemizle.addEventListener("click", allListRemove);
    window.addEventListener("load", pageLoaded);
    phoneInput.addEventListener('input', justNumbers);
    arama.addEventListener("keyup",filter)
};

function filter(e){
    const filterValue = e.target.value.toLowerCase().trim();
    const kaydedilenler = document.querySelectorAll("li");
    if(kaydedilenler.length > 0){
        kaydedilenler.forEach(function(kayitli){
            var isimInput = kayitli.querySelector('input[type="text"]');
            console.log(isimInput);
            if(isimInput.value.toLowerCase().trim().includes(filterValue)){
                kayitli.setAttribute("style", "display:block");
            }else{
                kayitli.setAttribute("style", "display:none");
            }
        })
    }else{
        showAlert("warning","HERHANGI BIR KAYIT BULUNMAMAKTADIR");
    }
}

function edit(li) {
    const inputs = li.querySelectorAll(".person-info input");
    const edit = li.querySelector(".fa-pen-to-square");
    const save = li.querySelector(".fa-check");
    let sadik = li.querySelector('input[type="text"]');

    save.style.visibility = "visible";
    edit.style.display = "none";


    inputs.forEach(input => {
        input.style.border = "1px solid";
        input.readOnly = false;
    });

    let once = 1;

    save.addEventListener("click",() => {
        edit.style.display = "block";
        save.style.visibility = "hidden";
        let a = inputs[0].value;
        console.log(a.trim());
        
        inputs.forEach(input => {
            input.style.border = "none";
            input.readOnly = true;
            
            const name = inputs[0].value.trim();
            const number = inputs[1].value;

            // Storage'de güncelleme
            updateListInStorage(li, name, number);
            sadik = name;

            if(once <= 1){
                showAlert("success", "Değişiklikler kaydedildi.");
            }
            once++;
        });
    })
}

function removeList(e){
    if(e.target.className === "fa-solid fa-xmark"){
        var confirmDelete = confirm('Silmek istiyor musunuz?');
        if(confirmDelete) {
            const li = e.target.parentElement.parentElement;
        const name = li.querySelector(".person-info input[type='text']").value;
        const number = li.querySelector(".person-info input[type='number']").value;
    
        li.remove();
    
        // Storage'den silme
        removeListFromStorage(name, number);
        showAlert("success", "Başarıyla silindi.");
        }
        
    }else if(e.target.className === "fa-regular fa-pen-to-square" ) {
        const li = e.target.parentElement.parentElement
        edit(li);
    }
}

function allListRemove() {
    let allLi = document.querySelectorAll("li"); 

    if(allLi.length > 0){
        const confirmed = confirm('Tüm listeyi silmek istediğinize emin misiniz?');

        if(confirmed) {
            allLi.forEach((li)=>{
                li.remove();
            })
    
            // Storage'den silme
            liste = [];
            localStorage.setItem("liste",JSON.stringify(liste))
            showAlert("success", "Tüm kayıt listesi silindi.")
        }else {
            showAlert("warning", "Silme işlemi iptal edildi.")
        }
    }else {
        showAlert("warning", "Herhangi bir kayıt bulunmamaktadır")
    }
    
}

function addList(e) {
    const inputText = nameInput.value.trim();
    const inputNumber = parseInt(phoneInput.value.trim());
    
    if (!isNaN(inputText)) {
        showAlert("warning","Lütfen isminizi doğru yazınız!")
        
    }else if(isNaN(inputNumber)){
        showAlert("warning","Lütfen Numaranızı doğru yazınız!")
        
    }
    else {
        addListToUI(inputText,inputNumber);
        //storage ekleme
        addListToStorage(inputText, inputNumber);
    }
    e.preventDefault()
    
}

function addListToUI(name,number) {
    ul.innerHTML += `
    <li>
        <div class="person-info">
            <div>
                <span>İsim: </span>
                <input type="text" value="${name}" maxlength="25" readonly="">
            </div>
            <div>
                <span>Telefon: </span> 
                <input type="number" value="${number}" maxlength="11" readonly="">
            </div>
        </div>
        <div class="changes">   
            <i class="fa-solid fa-check" style="visibility:hidden"></i>
            <i class="fa-regular fa-pen-to-square"></i>
            <i class="fa-solid fa-xmark"></i>
        </div>
    </li>`;
    
    nameInput.value = ""; 
    phoneInput.value = "";
}

function pageLoaded() {
    checkListFromStorage();
    liste.forEach( li => {
        addListToUI(li.name, li.number);
    })
}

function addListToStorage(inputText, inputNumber){
    checkListFromStorage();
    liste.push({name:inputText,number:inputNumber});
    localStorage.setItem("liste", JSON.stringify(liste));
}

function checkListFromStorage() {
    if(localStorage.getItem("liste") === null) {
        liste = [];
    } else {
        liste = JSON.parse(localStorage.getItem("liste"));
    }
}

function removeListFromStorage(name, number) {
    checkListFromStorage();
    liste = liste.filter((item) => item.name !== name || item.number !== number);

    liste.forEach((todo, index) => {
        if(number == todo.number && name == todo.name) {
            liste.splice(index, 1)
        }
    })
    localStorage.setItem("liste", JSON.stringify(liste));
}

function updateListInStorage(li, name, number) {
    checkListFromStorage();
    const index = Array.from(ul.children).indexOf(li);
    
    if (index !== -1) {
      liste[index].name = name;
      liste[index].number = number;
      localStorage.setItem("liste", JSON.stringify(liste));
    }
}

function justNumbers() {
    const enteredValue = phoneInput.value;
    // Sadece sayıları al
    const numbersOnly = enteredValue.replace(/\D/g, '');
  
    if (numbersOnly.length > 11) {
      phoneInput.value = numbersOnly.slice(0, 11);
    }
}

function showAlert(type,message) {
    const div = document.createElement("div");
    div.className = `alert alert-${type}`;
    div.textContent = message;
    cardBody.appendChild(div);
    setTimeout( ()=>{
        div.remove();
    }, 2400)
};
