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

function createQuill(containerId, formId, inputId, editorText) {
   var quill = new Quill(`#${containerId}`, {
      modules: {
         toolbar: [
            [{ 'size': ['small', false, 'large'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ['link', 'blockquote', 'code-block'],
            ['clean']
         ]
      },
      theme: 'snow'
   });

   var form = document.querySelector(`#${formId}`);
   form.onsubmit = function () {
      var text = document.querySelector('.ql-editor').innerHTML;
      var input = document.querySelector(`#${inputId}`)
      input.value = text;
      document.getElementById(formId).submit();
   };

   if (editorText) {
      quill.container.firstChild.innerHTML = editorText;
   }

   return quill;
}

// function createTinyMce(containerType, containerId) {
//    const tinyMce = tinymce.init({
//       selector: `${containerType}#${containerId}`,
//       min_height: 380,
//       menubar: false,
//       plugins: 'lists link',
//       toolbar: [
//          "newdocument undo redo bold italic underline numlist bullist indent outdent subscript superscript link selectall removeformat "
//       ],
//       menubar: false,
//       branding: false
//    });
//    return tinyMce;
// }