const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const saveButton = document.querySelector(".save");
const tumunuTemizle = document.querySelector("#clear-all");
const ul = document.querySelector(".recorded");
const form = document.querySelector(".task");
const cardBody = document.querySelector(".card-body");

let liste = [];

runEvents();
function runEvents() {
    form.addEventListener("submit", addList);
    ul.addEventListener("click", removeList); 
    tumunuTemizle.addEventListener("click", allListRemove);
    window.addEventListener("load", pageLoaded);
    phoneInput.addEventListener('input', justNumbers);

};


function edit(li) {
    const inputs = li.querySelectorAll(".person-info input");
    const edit = li.querySelector(".fa-pen-to-square")
    const save = li.querySelector(".fa-check");

    save.style.visibility = "visible";
    edit.style.display = "none";


    inputs.forEach(input => {
        input.style.border = "1px solid";
        input.readOnly = false;
    });

    // success alert bir defa calismasi icin
    let once = 1;

    save.addEventListener("click",() => {
        edit.style.display = "block";
        save.style.visibility = "hidden";

        inputs.forEach(input => {
            input.style.border = "none";
            input.readOnly = true;
            
            const name = inputs[0].value;
            const number = inputs[1].value;

            // Storage'de güncelleme
            updateListInStorage(li, name, number);

            if(once <= 1){
                showAlert("success", "Değişiklikler kaydedildi.");
            }
            once++;
        });
    })
}

// li sil
function removeList(e){
    if(e.target.className === "fa-solid fa-xmark"){
        const li = e.target.parentElement.parentElement;
        const name = li.querySelector(".person-info input[type='text']").value;
        const number = li.querySelector(".person-info input[type='number']").value;
    
        li.remove();
    
        // Storage'den silme
        removeListFromStorage(name, number);
        showAlert("success", "Başarıyla silindi.");
    }else if(e.target.className === "fa-regular fa-pen-to-square" ) {
        const li = e.target.parentElement.parentElement
        edit(li);
    }
}


// butun listeyi sil
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
    } 
    
}

// listeye ekle
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

// ekrana yazdir ve liste dizisine pushla
function addListToUI(name,number) {
    ul.innerHTML += `
    <li>
        <div class="person-info">
            <div>
                <span>İsim: </span>
                <input type="text" value="${name}" readonly="">
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

// sayfa yuklendiginde ekrana storage'dekileri getir
function pageLoaded() {
    checkListFromStorage();
    liste.forEach( li => {
        addListToUI(li.name, li.number);
    })
}

// storage ve listeye kaydet
function addListToStorage(inputText, inputNumber){
    checkListFromStorage();
    liste.push({name:inputText,number:inputNumber});
    localStorage.setItem("liste", JSON.stringify(liste));
}

// tum storage silme
function checkListFromStorage() {
    if(localStorage.getItem("liste") === null) {
        liste = [];
    } else {
        liste = JSON.parse(localStorage.getItem("liste"));
    }
}

// silinmek istenen tek bir kayit islemini storage'den sil
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

// duzenlenen bilgileri storage kaydet 
function updateListInStorage(li, name, number) {
    checkListFromStorage();
    const index = Array.from(ul.children).indexOf(li);
    
    if (index !== -1) {
      liste[index].name = name;
      liste[index].number = number;
      localStorage.setItem("liste", JSON.stringify(liste));
    }
}

// ilk girilen input kisminda karakter sinirla
function justNumbers() {
    const enteredValue = phoneInput.value;
    // Sadece sayıları al
    const numbersOnly = enteredValue.replace(/\D/g, '');
  
    if (numbersOnly.length > 10) {
      phoneInput.value = numbersOnly.slice(0, 10);
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
