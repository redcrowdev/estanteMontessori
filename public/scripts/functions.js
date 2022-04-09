function filterSearch() {
   let input, filter, ul, li, i, txtValue;
   input = document.getElementById('searchBox');
   filter = input.value.toLowerCase();
   ul = document.getElementById('searchList');
   li = ul.getElementsByTagName('li');

   for (i = 0; i < li.length; i++) {
      txtValue = li[i].textContent || li[i].innerText;
      if (txtValue.toLowerCase().indexOf(filter) > -1) {
         li[i].style.display = "";
      } else {
         li[i].style.display = "none";
      }
   }
}

function filterSearchDiv() {
   let input, filter, div, i, txtValue;
   input = document.getElementById('searchBox');
   filter = input.value.toLowerCase();
   div = document.getElementsByName('toggleDiv')
   for (i = 0; i < div.length; i++) {
      txtValue = div[i].textContent || div[i].innerText;
      if (txtValue.toLowerCase().indexOf(filter) > -1) {
         div[i].style.display = "";
      } else {
         div[i].style.display = "none";
      }
   }
}

function bootstrapFormValidation() {
   'use strict'
   var forms = document.querySelectorAll('.validate')
   Array.prototype.slice.call(forms)
      .forEach(function (form) {
         form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
               event.preventDefault()
               event.stopPropagation()
            }
            form.classList.add('was-validated')
         }, false)
      })
}