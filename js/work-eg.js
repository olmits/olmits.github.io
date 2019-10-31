let gridContainer = document.querySelector('.work-eg__container');
let jsonFile = 'work-eg.json';

function createGrid(numItems){
    let numRows =Math.floor(parseInt(numItems) / 4);
    
    let grid = document.querySelector('.work-eg__grid-container');
    if (grid){
        $('.work-eg__grid-container').css({"grid-template-rows": `repeat(${numRows}, 1fr)`,"height": `${160*numRows}px`})
        return grid
    } else{
        grid = document.createElement('div');
        grid.classList.add('work-eg__grid-container');
        grid.style.height = `${160*numRows}px`;
        grid.style.gridTemplateRows = `repeat(${numRows}, 1fr)`
        gridContainer.prepend(grid);
    }
    return grid
}

const showLoadingSpiner = () => {
    $('.ham__load-more').css({'margin-top': '2.5px'});
    $('.lds-work').show();    
};
const hideLoadingSpiner = () => {
    $('.ham__load-more').css({'margin': ''});
    $('.lds-work').hide()
};  

function createGridItem(item){
    let div = document.createElement('div');
    div.className = 'work-eg__grid-item';
    div.style.backgroundImage = `url(${item.url})`;
    div.dataset.workValue = item.cluster;
    div.dataset.workId = item.id;
    div.innerHTML = `<div class="grid-item__hover-div">
        <div class="grid-item__hover-div__buttons">
            <i class="fas fa-link"></i>
            <i class="fas fa-search fa-xs"></i>
        </div>
        <div class="grid-item__hover-div__info-service">${item.service_name}</div>
        <div class="grid-item__hover-div__info-cluster">${item.cluster_name}</div>
        </div>`
    return div
}

const getActiveQueries = () => {
    let existedQueries = Array.from($('.work-eg__grid-item')).map(function(item){
        return item.dataset.workId
    });
    return existedQueries
}

$('.work-filter__item').click(function(){
    let numActiveItems = getActiveQueries().length
    console.log(numActiveItems);
    
    $('.work-filter__item').removeClass("active");
    $(this).addClass("active");
    let key = $(this).data('workKey');
    $('.work-eg__grid-item').remove();
    
    showLoadingSpiner() // Show loading spiner
    setTimeout(function(){
        hideLoadingSpiner(); // Hide loading spiner
        proceedData(jsonFile, 12, key); // Load filtered data
    }, 2000);
})

$('.ham__load-more').click(function(){
    $('.work-filter__item').removeClass("active");
    $('.work-filter__item[data-work-key="all"]').addClass("active");
    let existedQueries = getActiveQueries();
    let num = existedQueries.length
    
    if(num <= 12){
        showLoadingSpiner() // Show loading spiner
        setTimeout(function(){
            hideLoadingSpiner(); // Hide loading spiner
            proceedData(jsonFile, 24, 'all', existedQueries); // Load filtered data
        }, 2000);
    } else if(num <= 24){
        showLoadingSpiner() // Show loading spiner
        setTimeout(function(){
            hideLoadingSpiner(); // Hide loading spiner
            proceedData(jsonFile, 36, 'all', existedQueries); // Load filtered data
            $('.ham__load-more').css({'visibility': 'hidden'})
        }, 2000);
    }
})

function proceedData(file, num, filter='all', ex=undefined){
    let gridSelector = createGrid(num);
    
    let existedQueries = getActiveQueries().length;  
    let numToProceed = parseInt(num) - parseInt(existedQueries);
    // Exists to calculate the proper number of items, so its number was equal to 12, 24 or 36
    
    
    $('.ham__load-more').css('visibility', 'visible');
    $.getJSON(file, function(json){
        let data = Array.from(json);
        data.sort(function() { return 0.5 - Math.random() });
        if(ex){
            data = data.filter(function(item){
                return !ex.includes(item.id);
            });
        }
        if(filter !== 'all') { 
            data = data.filter(function(item){
                return item.cluster === filter
            });
            console.log(data);
        }
        if(data.length < num) { num = data.length }
        
        data = data.slice(0, numToProceed);
        data.forEach(function(item){
            let div = createGridItem(item);
            gridSelector.append(div);
        });
    });
}

$(document).ready(function(){
    hideLoadingSpiner();
    proceedData(jsonFile, 12, 'all');
})
