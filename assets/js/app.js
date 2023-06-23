const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const saveButton = document.querySelector(".save");
const tumunuTemizle = document.querySelector("#clear-all");
const ul = document.querySelector(".recorded");
const form = document.querySelector(".task");
const cardBody = document.querySelector(".card-body");
const arama = document.querySelector("#nameSearch");

let liste = [];
let once = 1;

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
            if(isimInput.value.toLowerCase().trim().includes(filterValue)){
                kayitli.setAttribute("style", "display:flex");
            }else{
                kayitli.setAttribute("style", "display:none");
            }
        })
    }else {
        if(once===1){
            showAlert("warning","HERHANGI BIR KAYIT BULUNMAMAKTADIR");
            once++;
        }
    }
   e.target.addEventListener("blur",()=>{
    once=1;
   })
}


function edit(li) {
    if (localStorage.getItem('kilitlemeBayragi')===null) {
    
        const inputs = li.querySelectorAll(".person-info input");
        const edit = li.querySelector(".fa-pen-to-square");
        const save = li.querySelector(".fa-check");

        save.style.visibility = "visible";
        edit.style.display = "none";

        
            
        inputs.forEach(input => {
            input.style.border = "1px solid";
            input.readOnly = false;
        });

        localStorage.setItem('kilitlemeBayragi',true);
        
        
        save.addEventListener("click",() => {
            edit.style.display = "block";
            save.style.visibility = "hidden";

            
            inputs.forEach(input => {
                input.style.border = "none";
                input.readOnly = true;
                
                const name = inputs[0].value.trim();
                const number = inputs[1].value.trim();

                updateListInStorage(li, name, number);
                pageLoaded();

                if(once <= 1){
                    showAlert("success", "Değişiklikler kaydedildi.");
                }
                once++;
            });
            localStorage.removeItem('kilitlemeBayragi');
        })
      }else {
        showAlert("warning","Kayıt şu anda başka bir sekmede düzenleniyor");
    }   
}

function removeList(e){
    if(e.target.className === "fa-solid fa-xmark"){
        var confirmDelete = confirm('Silmek istiyor musunuz?');
        if(confirmDelete) {
            const li = e.target.parentElement.parentElement;
        const name = li.querySelector(".person-info input[type='text']").value;
        const number = li.querySelector(".person-info input[type='number']").value;
    
        li.remove();
    
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
    
            liste = [];
            localStorage.setItem("liste",JSON.stringify(liste))
            showAlert("success", "Tüm kayıt listesi silindi.")
            localStorage.removeItem('kilitlemeBayragi');
        }else {
            showAlert("warning", "Silme işlemi iptal edildi.")
        }
    }else {
        showAlert("warning", "Herhangi bir kayıt bulunmamaktadır")
    }
    
}




// function checkList(inputText) {
//     const kayitlilar = document.querySelectorAll("li");
//     let kayitVar = false;
  
//     kayitlilar.forEach(function (kayitli) {
//       var isimInput = kayitli.querySelector('input[type="text"]');
//       if (isimInput.value.toLowerCase().trim().includes(inputText)) {
//         kayitVar = true;
//         showAlert("warning", "Bu kayıt zaten mevcut!");
//       }
//     });
  
//     if (!kayitVar) {
//       // Kaydı listeye ekleme işlemi burada yapılabilir
//       // ...
//     }
  
// }

function addList(e) {
    const inputText = nameInput.value.trim();
    const inputNumber = parseInt(phoneInput.value.trim());
    const kayitlilar = document.querySelectorAll("li");
    let listedekiIsimler = [];
    let listedekiNumaralar = [];

    kayitlilar.forEach(function(kayitli){
        let isimInput = kayitli.querySelector('input[type="text"]');
        let numberInput = kayitli.querySelector('input[type="number"]');
        listedekiIsimler.push(isimInput.value);
        listedekiNumaralar.push(numberInput.value);
    })

    if (!isNaN(inputText)) {
        showAlert("warning","Lütfen isminizi doğru yazınız!")
            
    }else if(isNaN(inputNumber)){
        showAlert("warning","Lütfen Numaranızı doğru yazınız!")
            
    }else if(listedekiIsimler.includes(inputText) && listedekiNumaralar.includes(inputNumber)){
        showAlert("warning", "böyle bir kayit vardir")
    }
    else {
        addListToUI(inputText,inputNumber);

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
    let listItems=document.querySelector('.recorded');
    listItems.innerHTML='';
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
    const numbersOnly = enteredValue.replace(/[^0-9]/g, '');
  
    if (numbersOnly.length >= 11) {
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
