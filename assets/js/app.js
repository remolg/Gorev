const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const saveButton = document.querySelector(".save");
const tumunuTemizle = document.querySelector("#clear-all");
const ul = document.querySelector(".recorded");
const form = document.querySelector(".task");
const cardBody = document.querySelector(".card-body");
const arama = document.querySelector("#nameSearch");
const version = 1;

let liste = [];


runEvents();
function runEvents() {
    window.addEventListener('load', function () {
        idCounter = parseInt(localStorage.getItem('idCounter')) || 1;
    });
    form.addEventListener("submit", addList);
    ul.addEventListener("click", removeList);
    tumunuTemizle.addEventListener("click", allListRemove);
    window.addEventListener("load", pageLoaded);
    phoneInput.addEventListener('input', justNumbers);
    arama.addEventListener("keyup", filter)

};

function filter(e) {
    const filterValue = e.target.value.toLowerCase().trim();
    const kaydedilenler = document.querySelectorAll("li");

    if (kaydedilenler.length > 0) {
        kaydedilenler.forEach((kayitli) => {
            var isimInput = kayitli.querySelector('input[type="text"]');
            isimInput.value.toLowerCase().trim().includes(filterValue) ?
                kayitli.setAttribute("style", "display:flex") : kayitli.setAttribute("style", "display:none");
        })
    } else {
        showPopup('error', 'Afedersin...', 'HERHANGI BIR KAYIT BULUNMAMAKTADIR');
    }

}


function edit(li) {
    const inputs = li.querySelectorAll(".person-info input");
    const edit = li.querySelector(".fa-pen-to-square");
    const save = li.querySelector(".fa-check");
    const cancel = li.querySelector(".fa-ban");
    const deleteButton = li.querySelector(".fa-xmark");

    save.style.display = "block";
    cancel.style.display = "block";
    edit.style.display = "none";
    deleteButton.style.display = "none";

    inputs.forEach(input => {
        input.style.border = "1px solid";
        input.readOnly = false;
    });

    save.addEventListener("click", () => {
        var versionPlus = li.getAttribute('version');
        var veri = localStorage.getItem("liste");
        var veriNesnesi = JSON.parse(veri);
        var istenenIndex = li.id - 1;
        var istenenVersiyon = veriNesnesi[istenenIndex].version;

        if (versionPlus == istenenVersiyon) {
            console.log(versionPlus, istenenVersiyon)
            versionPlus++;
            edit.style.display = "block";
            save.style.display = "none";
            cancel.style.display = "none";

            inputs.forEach(input => {


                input.style.border = "none";
                input.readOnly = true;

                const name = inputs[0].value.trim();
                const number = inputs[1].value.trim();
                const version = versionPlus;

                updateListInStorage(li, name, number, version);
                pageLoaded();

                showPopup('success', 'Tebrikler!', 'Kayıt düzenlendi');
            });
        } else {
            showPopup('error', 'Hata!', 'Kaydın yeni versiyonu oluşturuldu sayfayı yenileyip tekrar deneyin!');
        }
    });



    cancel.addEventListener("click", () => {
        deleteButton.style.display = "block";
        edit.style.display = "block";
        save.style.display = "none";
        cancel.style.display = "none";

        inputs.forEach(input => {
            input.style.border = "none";
            input.readOnly = true;

            pageLoaded();
            showPopup('error', 'Aman Dikkat!', 'Kayıt düzenlemesi iptal edildi.');
        });

    })



}

function removeList(e) {
    if (e.target.className === "fa-solid fa-xmark") {
        Swal.fire({
            title: 'DİKKAT',
            text: "Silmek istiyor musunuz?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet!',
            cancelButtonText: 'Hayır!'

        }).then((result) => {
            if (result.isConfirmed) {
                const li = e.target.parentElement.parentElement;
                const name = li.querySelector(".person-info input[type='text']").value;
                const number = li.querySelector(".person-info input[type='number']").value;

                li.remove();

                removeListFromStorage(name, number);
                showPopup('success', 'Tebrikler!', 'Başarıyla silindi.');
            }
        })

    } else if (e.target.className === "fa-regular fa-pen-to-square") {
        const li = e.target.parentElement.parentElement
        edit(li);
    }
}

function allListRemove() {
    let allLi = document.querySelectorAll("li");

    if (allLi.length > 0) {
        Swal.fire({
            title: 'DİKKAT',
            text: "Tüm listeyi silmek istediğinize emin misiniz?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet, sil gitsin!',
            cancelButtonText: 'Hayır'
        }).then((result) => {
            if (result.isConfirmed) {
                allLi.forEach((li) => {
                    li.remove();
                })

                liste = [];
                localStorage.setItem("liste", JSON.stringify(liste));

                idCounter = 1;
                localStorage.setItem('idCounter', idCounter.toString());

                showPopup('success', 'Tebrikler!', 'Tüm kayıt listesi silindi.');
            } else {
                showPopup('success', 'Tebrikler!', 'Silme işlemi iptal edildi');
            }
        })
    } else {
        showPopup('error', 'BURASI BOMBOŞ', 'Herhangi bir kayıt bulunmamaktadır');
    }
}

let idCounter = parseInt(localStorage.getItem('idCounter')) || 1;



function addList(e) {
    const itemId = idCounter;
    const inputText = nameInput.value.trim();
    const inputNumber = parseInt(phoneInput.value.trim());
    const kayitlilar = document.querySelectorAll("li");
    let listedekiIsimler = [];
    let listedekiNumaralar = [];


    if (nameInput.value === '' || phoneInput.value === '') {
        showPopup('error', 'Boş Kutu', 'Lütfen kutucukları doldurun');
    } else {
        kayitlilar.forEach(function (kayitli) {
            let isimInput = kayitli.querySelector('input[type="text"]');
            let numberInput = kayitli.querySelector('input[type="number"]');
            listedekiIsimler.push(isimInput.value);
            listedekiNumaralar.push(parseInt(numberInput.value));
        })
        if (!isNaN(inputText)) {
            showPopup('error', 'İsim Hatası', 'Lütfen isminizi doğru yazınız!');
        } else if (phoneInput.value.length < 11 || phoneInput.value.length > 11) {
            showPopup('error', 'Numara Hatası', 'Lütfen Numaranızı doğru yazınız!');
        } else if (listedekiIsimler.includes(inputText) || listedekiNumaralar.includes(inputNumber)) {
            showPopup('error', 'Dikkat', 'Böyle bir kayit vardir');
        }
        else {
            addListToUI(inputText, inputNumber, itemId, version);

            addListToStorage(inputText, inputNumber, itemId, version);

            idCounter++;
            localStorage.setItem('idCounter', idCounter.toString());
        }
    }
    e.preventDefault()

}


function addListToUI(name, number, itemId, version) {
    ul.innerHTML += `
    <li id="${itemId}" version="${version}">
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
            <i class="fa-solid fa-check" style="display:none"></i>
            <i class="fa-solid fa-ban" style="display:none"></i>
            <i class="fa-regular fa-pen-to-square"></i>
            <i class="fa-solid fa-xmark"></i>
        </div>
    </li>`;

    nameInput.value = "";
    phoneInput.value = "";
}

function pageLoaded() {
    checkListFromStorage();
    let listItems = document.querySelector('.recorded');
    listItems.innerHTML = '';
    liste.forEach(li => {
        addListToUI(li.name, li.number, li.id, li.version);
    })
}

function addListToStorage(inputText, inputNumber, itemId, version) {
    checkListFromStorage();
    liste.push({ name: inputText, number: inputNumber, id: itemId, version: version });
    localStorage.setItem("liste", JSON.stringify(liste));
}

function checkListFromStorage() {
    if (localStorage.getItem("liste") === null) {
        liste = [];
    } else {
        liste = JSON.parse(localStorage.getItem("liste"));
    }
}

function removeListFromStorage(name, number) {
    checkListFromStorage();
    liste = liste.filter((item) => item.name !== name || item.number !== number);

    liste.forEach((todo, index) => {
        if (number == todo.number && name == todo.name) {
            liste.splice(index, 1)
        }
    })
    localStorage.setItem("liste", JSON.stringify(liste));
}

function updateListInStorage(li, name, number, version) {
    checkListFromStorage();
    const index = Array.from(ul.children).indexOf(li);
    if (index !== -1) {

        liste[index].name = name;
        liste[index].number = number;
        liste[index].version = version;
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

function showPopup(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
    });
}

// qs kislat
// id ekle 