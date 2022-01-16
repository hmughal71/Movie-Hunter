const nameEL = document.getElementById("name");
const emailEL = document.getElementById("email");
const phoneEL = document.getElementById("phone");
const sbjEL = document.getElementById("sbj");
const msgEL = document.getElementById("msg");
const contactusEL = document.getElementById("contactus");
contactusEL.addEventListener("click", () => {
  console.log(
    "Send pressed",
    nameEL.value,
    emailEL.value,
    phoneEL.value,
    sbjEL.value,
    msgEL.value
  );
  const body = `mesg from ${nameEL.value}
               email: ${emailEL.value}
               phone: ${phoneEL.value}
               subj: ${sbjEL.value}
               msg: ${msgEL.value}  
  
  `;
  window.open(`mailto:${emailEL.value}?subject=${sbjEL.value}&body=${body}`);
});
