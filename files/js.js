
// Model, as a object literal:

var model = {
    selectedCat: null,
    cats: [
        {
        name: "Adaś",
        clickCount: 0,
        imageUrl:
            "https://v.cdn.vine.co/r/avatars/F3F364BD721142905026210344960_3082815fbb9.0.1.jpg?versionId=U8Jyj8bEX6fFzlF5rn_hix3Yw9ABYd5H"
        },
        {
        name: "Lila",
        clickCount: 0,
        imageUrl:
            "https://www.dogalize.com/wp-content/uploads/2017/07/happy-cat-200x200.jpg"
        },
        {
        name: "Ania",
        clickCount: 0,
        imageUrl:
            "https://www.dogalize.com/wp-content/uploads/2017/10/cat-meowing-200x200.jpg"
        },
        {
        name: "Paweł",
        clickCount: 0,
        imageUrl:
            "http://www.paradise4pawsdenver.com/wp-content/uploads/2014/12/catboardingcircle-200x200.jpg"
        }
    ] // end of cats array
}; // end of model

// Octopus:
var octopus = {
    init(){
        // setting current cat:
        model.selectedCat = model.cats[0];
        this.getSelectedCat();
        view.init();
        viewList.init();
        viewAdmin.init();
    },
    getAllCats(){
        return model.cats;
    },
    getSelectedCat(){
        return model.selectedCat;   
    },
    incrementCounter(){
        model.selectedCat.clickCount++;
        view.render();
    },
    setCurrentCat(cat){
        model.selectedCat = cat;
        console.log("setCurrentCat working? ", model.selectedCat);
        view.render();
    },
    updateModel(name=null, imageUrl=null, clickCount=null){
      console.log("updateModel function o", name, imageUrl, clickCount)
      this.getSelectedCat().name = name;
      this.getSelectedCat().imageUrl = imageUrl;
      this.getSelectedCat().clickCount = clickCount;
      view.render();
      viewAdmin.render();  
      
    },
    handleCancelButton(){
        viewAdmin.render();
    }


};

// View:
var view = {
    init(){
        // store pointers to our DOM elements for easy access later:
        this.catDetails = document.querySelector("#cat-details");
        this.catName = document.querySelector("#cat-name");
        this.catCounter = document.querySelector("#cat-counter");
        this.catPicture = document.querySelector("#cat-picture");

        // onclick, incrementation:
        this.catPicture.addEventListener('click', function(){
            octopus.incrementCounter();
        });

        // render this view:
        this.render()

    }, // end of init()

    render(){
        //update the DOM elements with values from current cat:
        var selectedCat = octopus.getSelectedCat();

        this.catName.textContent = selectedCat.name;
        this.catCounter.textContent = selectedCat.clickCount;
        this.catPicture.src = selectedCat.imageUrl;
    }

}

var viewList = {
    //1. init: store DOM element, we need this happend only one time
    init: function(){
        this.catsList = document.querySelector("#cats-list");
        this.render();
    },
    //2. render reusable elements
    render: function(){
        // get all cats:
        var cats = octopus.getAllCats();

        // empty the cat list:
        this.catsList.innerHTML = "";

        // loop over cats, and generete list items
        for(var i = 0; i<cats.length; i++){
            // create li element:
            var listItem = document.createElement('li');
            // asign value to li:
            listItem.textContent = cats[i].name;

            //add click listener in order to change selectedCat:
            listItem.addEventListener('click', (function(cat){
                return function(){
                    octopus.setCurrentCat(cat);
                    viewAdmin.render();
                }
            })(cats[i]));

            // add all to unordered list ul:
            this.catsList.appendChild(listItem);

        }
    } // end of render
} // end of viewList

var viewAdmin = {
    init: function(){
        // store pointers to our DOM elements for later use
        this.adminArea = document.querySelector("#admin-area");
        // run rest of admin area:
        this.render();
    },

    render: function(){
        // cleaning: 
        this.adminArea.innerHTML = "";

        // creating and adding button to the page:
        var button = document.createElement("BUTTON"); // creating button
        var buttonText = document.createTextNode("ADMIN"); // creating text for button by createTextNode
        button.appendChild(buttonText); // appling textNOde to button
        this.adminArea.appendChild(button); // append button to html

        // adding functionality to the button:
        button.addEventListener('click', function(){
            viewAdmin.openAdminArea();
        }); 
    }, // end of render

    openAdminArea: function(){
        this.adminArea.innerHTML = "";
        var form = document.createElement("form");
            form.setAttribute("method", "post");

        var inputName = document.createElement('input');
            inputName.setAttribute("type", "text");
            inputName.setAttribute('name', 'name')
            inputName.setAttribute("value", octopus.getSelectedCat().name);
        
        var inputImageUrl = document.createElement("input");
            inputImageUrl.setAttribute("type", "text");
            inputImageUrl.setAttribute("name", "imageUrl");
            inputImageUrl.setAttribute("value", octopus.getSelectedCat().imageUrl)

        var inputClickCount = document.createElement("input");
            inputClickCount.setAttribute("type", "text");
            inputClickCount.setAttribute("name", "clickCount");
            inputClickCount.setAttribute("value", octopus.getSelectedCat().clickCount);

        var submitButton = document.createElement("input");
            submitButton.setAttribute("type", "submit");
            submitButton.setAttribute("value", "submit");
        
        
        var cancelButton = document.createElement("BUTTON");
            var cancelButtonTextNode = document.createTextNode('cancel')
            cancelButton.setAttribute("type", "button");
            cancelButton.appendChild(cancelButtonTextNode);

        form.appendChild(inputName);
        form.appendChild(inputImageUrl);
        form.appendChild(inputClickCount);
        form.appendChild(submitButton);
        form.appendChild(cancelButton);

        this.adminArea.appendChild(form);

        // adding functionality to form buttons:
        if(form.attachEvent){
            form.attachEvent('submit', viewAdmin.handleSubmitForm)
        } else {
            form.addEventListener('submit', viewAdmin.handleSubmitForm)
        }
        // cancel button functionality:
        cancelButton.addEventListener("click", octopus.handleCancelButton);

    }, // end of openAdminArea
    
    handleSubmitForm: function(e){
        if(e.preventDefault) e.preventDefault();
        console.log("this from handle Submit form: ", this);
        var name = e.target.name.value, 
            imageUrl = e.target.imageUrl.value, 
            clickCount = e.target.clickCount.value;
        octopus.updateModel(name, imageUrl, clickCount);
        return false;
    }    

}
octopus.init();
