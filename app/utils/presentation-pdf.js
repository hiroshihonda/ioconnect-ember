export default function presentationPdf(slider, el) {

  el = el || document.body;

  var element = document.createElement("div"),
    doc = new jsPDF('landscape', 'pt', 'a4'),
    currentSlide = 0,
    slideCount = slider.get('slides').length;

  slider.replaceIn(element);
  slider.set('showArrows', false);
  slider.set('currentSlideIndex', currentSlide);

  console.log(element);

  $(el).html(element);

  var addPages = function (finishCallback) {
    if (currentSlide == slideCount) {
      console.log('finish', slideCount);
      return finishCallback();
    }
    if (currentSlide > 0) {
      doc.addPage();
    }
    slider.set('currentSlideIndex', currentSlide);
    currentSlide++;

    //setTimeout(function () {
    //  addPages(finishCallback);
    //  //html2canvas(element, {
    //  //  logging: true,
    //  //  allowTaint: true
    //  //}).then(function (canvas) {
    //  //  var result = canvas.toDataURL();
    //  //  doc.addImage(result, 'JPEG', 0, 0);
    //  //
    //  //}, function (err) {
    //  //  console.log('Failed html2canvas', err);
    //  //});
    //}, 1500);


  };

  setTimeout(function () {
    addPages(function () {
      console.log('Calling save document');
      //doc.save('Test-Presentation.pdf');
    });
  }, 500);

}
