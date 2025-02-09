document
  .getElementById("xlFileSubmitBtn")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    const file = document.getElementById("xlFileSubmitInp").files[0];
    if (!file) {
      alert("Please select a file!");
      return;
    }
    const reader = new FileReader();
    reader.onload = async function (event) {
      const fileBuffer = event.target.result;
      const response = await api.ParseExcelAndSave({
        name: file.name,
        type: file.type,
        buffer: fileBuffer,
      });
      if (response.success) {
        const modalElement = document.getElementById("exampleModal");
        const modalInstance =
          bootstrap.Modal.getInstance(modalElement) ||
          new bootstrap.Modal(modalElement);
        modalInstance.hide();
      }
    };

    reader.readAsArrayBuffer(file);
  });
