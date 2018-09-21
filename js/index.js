
const paleo = {};
// *************Array of Time Periods *****************
paleo.time_periods = [
    {},
    {
        name: "Cambrian",
        abr: "Cm",
        id: 22,
        animals: 185, 
    }, 
    {
        name: "Devonian",
        abr: "D",
        id: 19,
        animals: 133
    }, 
    // only chordata
    {
        name: "Carboniferous",
        abr: "C",
        id: 18,
        animals: 296
    }, 
    {
        name: "Permian",
        abr: "P",
        id: 17,
        animals: 359
    }, 
    {
        name: "Triassic",
        abr: "Tr",
        id: 16,
        animals: 397
    }, 
    {
        name: "Jurassic",
        abr: "J",
        id: 15,
        animals: 404
    }, 
    {
        name: "Cretaceous",
        abr: "K",
        id: 14,
        animals: 1149
    }, 
    {
        name: "Paleogene",
        abr: "Pg",
        id: 26,
        animals: 1123
    }, 
    {
        name: "Neogene",
        abr: "Ng",
        id: 25,
        animals: 1241
    },
    {
        name: "Quaternary",
        abr: "Q",
        id: 12,
        animals: 1086
    }
];

// *************Array of Search Terms *****************
paleo.base_names =["","Chordata,Radiodonta,Asaphida", "Chordata,Radiodonta,Asaphida", "Chordata", "Tetrapoda", "Tetrapoda", "Tetrapoda", "Tetrapoda", "Perissodactyla,Artiodactyla,Aves,Embrithopoda,Proboscidea", "Perissodactyla,Artiodactyla,Aves,Embrithopoda,Proboscidea","Perissodactyla,Artiodactyla,Aves,Embrithopoda,Proboscidea,Carnivora"]

paleo.suggest_Names = ["Opabinia", "Quetzacoatlus", "Sharovipteryx", "Arsinoitherium", "Felis", "Allosaurus", "Glyptodon", "Gigantopithecus", "Halszkaraptor", "Carnotaurus", "Paraceratherium", "Dunkleosteus", "Titanoboa", "Gorgonops"]

paleo.new_width = $(".accordion").width() - 250;
paleo.active_panel = $(".accordion li.panel:first");
paleo.accordion = $(".accordion").position().top - 50;
paleo.last_panel = 0;

paleo.animal_panel = (panel) =>{
    const panel_val = panel.substring(panel.lastIndexOf("-") + 1);
    
    if (panel_val > 0) {
        $(`.${panel} .panel-content`).empty();
        let panel_name = $("<h1>").text(paleo.time_periods[panel_val].name);
        $(`.${panel} .panel-content`).append(panel_name);
            paleo.get_animals(panel_val);
    }
    else{
        $(`.${panel} .panel-content`).append(
            `<p>Thanks to the <a href="https://paleobiodb.org">PaleoDB</a> and <a href="https://www.mediawiki.org">MediaWiki</a>. </p>
            <p>Splash art is by <a href="https://unsplash.com/@justynwarner">Justyn Warner</a></p>`)
    }
    paleo.clear_inactive();
    
    if($(".accordion")[0].clientWidth < 640){
        $(".wrap").animate({ scrollTop: paleo.accordion - 10 }, 700);
    }
    else{
        $(".wrap").animate({ scrollTop: paleo.accordion }, 700);
    }
    
}

paleo.animal_search = () =>
    $(".animal-search-button").on("click", function () {
        $(".error-message").remove();
        let search_term = $(".animal-search").val();
        $.ajax({
            url: "https://paleobiodb.org/data1.2/taxa/single.json",
            method: "GET",
            dataType: "json",
            data: {
                taxon_name: search_term,
                show: "full"
            }
        }).fail(() => {
            let $error_message = $("<p>").addClass("error-message").text("We cant find an animal with that name.  Please be more specific or look through the panels below.");
            $(".search-form").append($error_message);
        }).then((res) => {
            window.location = `animal-info.html?name=${res.records[0].nam}`

        });
    });

// fade out old content
paleo.clear_inactive = () => {
    $(":not(.active)>.panel-content").empty();
}

paleo.flickity_gallery = () => {
    $(".carousel").flickity({
        cellAlign: "left",
        contain: true,
        wrapAround: true,
        autoPlay: 6000,
        pageDots: false,
        pauseAutoPlayOnHover: false
    })
}

// get animal to display
paleo.get_animals = (panel_id) => {
    paleo.clear_inactive();
    $(`.panel-${panel_id} .panel-content .more-animals`).remove();
    
    for (let i = 0; i < 12; i++) {
        let $loading_div = $("<div>").addClass(`animal-block loading`);
        let $loading_img = $("<img>").attr("src", "assets/Wedges-3s-200px.svg");
        let $loading_dots = $("<h3>").append($("<img>").attr("src","assets/Ellipsis-1s-50px.svg"));
        $loading_div.append($loading_img, $loading_dots);
        $(`.panel-${panel_id} .panel-content`).append($loading_div);
    }
    $(`.panel-${panel_id} .panel-content`).append($("<h3>").addClass("loading").append($("<img>").attr("src", "assets/Ellipsis-1s-50px.svg")));
    $.ajax({
        url: "https://paleobiodb.org/data1.2/occs/taxa.json",
        format: "GET",
        dataType: "json",
        data: {
            interval_id: paleo.time_periods[panel_id].id,
            base_name: paleo.base_names[panel_id],
            rank: "genus",
            show: "img",
            limit: paleo.time_periods[panel_id].animals,

        }
    }).then((res) => {
        
        $(`.panel-${panel_id} .panel-content .loading`).remove();
        for(let i = 0; i < 12; i++){
            let record_num = Math.floor(Math.random() * paleo.time_periods[panel_id].animals)
            res.records[record_num]

            let img_id = res.records[record_num].img.substring(res.records[record_num].img.lastIndexOf(":") + 1);
            let $animal_block = $("<div>", {}).addClass("animal-block").bind("click", function(){
                window.location = `animal-info.html?name=${res.records[record_num].nam}`;
            });
            let $animal_img = $("<img>").attr("src", `https://paleobiodb.org/data1.2/taxa/thumb.png?id=${img_id}`).attr("alt", "Animal Thumbnail");
            let $animal_name = $("<h3>").append(res.records[record_num].nam);
            $animal_block.append($animal_img, $animal_name);
            $(`.panel-${panel_id} .panel-content`).append($animal_block);
        } 
    });
    
}
// click event mobile buttons
paleo.mobile_buttons = () => {
    $(".carousel").on("staticClick.flickity", function (event, pointer, cellElement, cellIndex) {

        if (!$(`.accordion.panel.${cellElement.classList[1]}`).is('.active')) {
            // fade out old content
            $(paleo.active_panel).find(".panel-content").empty();           
            paleo.move_panel($(`.accordion .${cellElement.classList[1]}`)[0]);
        };
    });
}
// method that changes panels
paleo.move_panel = (next_item) => {

    // set height
    if (next_item.classList[1] == "panel-0") {
        $(".panel").animate({ height: "16vh" }, 300);
    }
    else {
        // $(".panel").animate({ height: "100vh" }, 300);
        $(".panel").css("height", "100vh");
    }

    // shrink old panel, grow new panel
    if(window.matchMedia("(max-width: 640px").matches == true){
        
        $(paleo.active_panel).animate({ width: "0px" }, 300);
        $(next_item).animate({ width: "100vw" }, 300);
    }
    else{
        $(paleo.active_panel).animate({ width: "25px" }, 300);
        $(next_item).animate({ width: paleo.new_width }, 300);
    }
    // change new panel to active panel
    $('.accordion .panel').removeClass('active');
    $(next_item).addClass('active');
    paleo.active_panel = $(".accordion li.panel.active");
    paleo.animal_panel(paleo.active_panel[0].classList[1]);
    $(".panel").css("height", "auto");
    
}
// click event handler for panel
paleo.panel_click = function () {
    $(".accordion").on("click", ".panel", function () {
        if (!$(this).is('.active')) {
            // fade out old content
            $(paleo.active_panel).find(".panel-content").empty();

            paleo.move_panel(this);
        };
    });
}

// key press event handler
paleo.panel_key_nav = () => {

    $(document).keydown(function (e) {

        if (e.keyCode == 39 && paleo.active_panel[0].classList[1] != "panel-10") {

            paleo.move_panel(paleo.active_panel.next()[0]);
        }
        if (e.keyCode == 37 && paleo.active_panel[0].classList[1] != "panel-0") {
            paleo.move_panel(paleo.active_panel.prev()[0]);
        }
    })
}

//go back to top
paleo.to_top = () => {
    $(".to-top").on("click", function () {
        $(".wrap").animate({ scrollTop: 0 }, 700);
    });
}

//when the window is resized
paleo.window_resize = () => {
    $(window).on("resize", function () {
        if (window.matchMedia("(max-width: 640px").matches == true) {
            
            !$(`.accordion .panel:not(.active)`).css("width", "0px");
            !$(`.accordion .panel.active`).css("width", "100vw");
            paleo.new_width = $(".accordion").width()
        }
        else{
            // update all variables that you need
            paleo.new_width = $(".accordion").width() - 250;
            !$(`.accordion .panel:not(.active)`).css("width", "25px");
            $(".panel.active").animate({ width: paleo.new_width }, 1);
        }
        
    });
}

//Scrolling Events
paleo.wrap_scroll = () => {
    $("#wrap").on("scroll", function () {
        if (paleo.active_panel[0].classList[1] != "panel-0") {
            if ($(".accordion").height() < (this.scrollTop + 150) && (this.scrollTop + 150) > paleo.last_panel) {
                paleo.last_panel = $("accordion").height();
                const panel = paleo.active_panel[0].classList[1]
                const panel_val = panel.substring(panel.lastIndexOf("-") + 1);
                paleo.get_animals(panel_val);
                paleo.last_panel = 0;
            }
        }
        if (this.scrollTop > 310) {
            $("#wrap").addClass("fixed-search");
        }
        else {
            $("#wrap").removeClass("fixed-search");
        }
    });
}
paleo.mobileCheck = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        $("header").addClass("mobile");
    }
}




// initialization
paleo.init = () => {
    paleo.panel_click();
    paleo.panel_key_nav();
    paleo.window_resize();
    paleo.wrap_scroll();
    paleo.animal_search();
    paleo.flickity_gallery();
    paleo.mobile_buttons();
    paleo.to_top();
    paleo.mobileCheck();

    $(paleo.active_panel).addClass('active');
    paleo.active_panel.focus();
}

// **********On page load**********
$(function () {  
    paleo.init();
});
