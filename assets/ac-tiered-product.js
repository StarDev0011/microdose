ACDiscountApp.PDPage.DisplayTiers = function () {

    function makeTimer(end_date) {
    if(globalFields.isProduct_Page){
      if(end_date != null){
      jQuery("#ac_countDown").css("display", "block");
        var endTime =  new Date(end_date);			
          endTime = (Date.parse(endTime) / 1000);
          var now = new Date();
          now = (Date.parse(now) / 1000);
          var timeLeft = endTime - now;
          var days = Math.floor(timeLeft / 86400); 
          var hours = Math.floor(timeLeft / 3600);
            var exactHour = hours % 24;
          var minutes = Math.floor((timeLeft - (hours * 3600 )) / 60);
          var seconds = Math.floor((timeLeft - (hours * 3600) - (minutes * 60)));
            var isDays = false;
            if (days > 0 || hours > 24){isDays = true;}
          if (days < 0) { days = "00"; /*hours = "0"; minutes = "0"; seconds = "0";*/ }
          if (hours < 10) { hours = "0" + hours; }
          if (minutes < 10) { minutes = "0" + minutes; }
          if (seconds < 10) { seconds = "0" + seconds; }
            if(timeLeft > 0){
            if(isDays){
                $(".ac__days").html(days); $(".ac__hours").html(exactHour); $(".ac__minutes").html(minutes);
              $(".ac_sec, .ac__colon.seconds").hide();
            }
            else{
                $(".ac__hours").html(exactHour); $(".ac__minutes").html(minutes); $(".ac__seconds").html(seconds);		
              $(".ac_day, .ac__colon.hours").hide(); $(".ac_sec, .ac__colon.seconds").show();
            }
            }
            else{jQuery('.ac__settings__table, #ac_countDown').remove();}
        
        setTimeout(function () {
            jQuery('.ac__settings__table').after(jQuery("#ac_countDown"));
        }, 500);
      }
    }
  }   

  var hide_buttons = null;
  var HideAdditionalPayments = function() {      
    hide_buttons = setInterval(function() {
      console.log('pdp buttons and tiered');
      if(jQuery('.shopify-payment-button__button').length>0){
        jQuery('.shopify-payment-button__button').hide();
        clearInterval(hide_buttons);
      }
    }, 500);
  }

  this.DisplayTiersFn = function () {
      setTimeout(function () {
          jQuery('.ac__settings__table').remove();
          var selectedVariant = jQuery('input[name^=id]:checked, select[name^=id], input[name=id], hidden[name^=id]', jQuery('form[action="/cart/add"]')).val();
          if (selectedVariant != null && globalFieldsProductPage_AC.productMetafield != '[]' && globalFieldsProductPage_AC.productMetafield != undefined) {
              var tierObj = globalFields.GetTierObject(globalFieldsProductPage_AC.productMetafield, selectedVariant);
              if (tierObj != undefined && tierObj.status && globalFields.StartEndDateValid(tierObj.start_date, tierObj.end_date)) {
              var getDates = globalFields.TimerStartEndDateValid(tierObj.start_date, tierObj.end_date);
              getDates.valid; getDates.start_date; getDates.end_date;
              let timer_settings = parsed_timer_settings;                
              WriteTableHeading(tierObj);
              WriteTableRows(tierObj, selectedVariant);
              if(timer_settings != undefined){                
                if(timer_settings.TimerStatus){  
                  if(getDates.valid){
                      setInterval(function() { makeTimer(getDates.end_date); }, 1000);
                  }
                }
              }
                jQuery('.shopify-payment-button__button').hide();
                setTimeout(function(){
                  jQuery('.shopify-payment-button__button').hide();
                  HideAdditionalPayments();
                }, 2000);
                setTimeout(function(){
                  clearInterval(hide_buttons);
                }, 5000);
              }
          }
      }, 200);
  }
  
  setTimeout(function(){
    clearInterval(hide_buttons);
  }, 10000);

  this.OnVariantChange = function () {
      setTimeout(function () {
          $(".js.product-form__input label").click(function () {
              displayTiers.DisplayTiersFn();
          });
      }, 2000);
  }

  var TableHeadHtml = function (contentHtml, tableSelector, position) {
      jQuery(tableSelector).before(contentHtml)
  }

  var WriteTableHeading = function (tierObj) {
    var tableSelector = '.product-form form[action="/cart/add"]';
      if (globalFields.settings.selected_table == "table1") {
          TableHeadHtml('<table class="ac__settings__table ac_table1" id="ac_table1"><tbody class="ac__tbody"><tr class="ac__tr ac__tr1"><th class="ac__th ac__th1" >' + globalFields.settings.table_headers.header1_value + '</th><th class="ac__th ac__th2" >' + globalFields.settings.table_headers.header2_value + '</th></tr></tbody></table>', tableSelector);
      }
      if (globalFields.settings.selected_table == "table2") {

          TableHeadHtml('<table class="ac__settings__table ac_table2" id="ac_table2"><tbody class="ac__tbody"><tr class="ac__tr ac__tr1"><th class="ac__th ac__th1" >' + globalFields.settings.table_headers.header1_value + '</th><th class="ac__th ac__th2" >' + globalFields.settings.table_headers.header2_value + '</th><th class="ac__th ac__th3">' + globalFields.settings.table_headers.header3_value + '</th></tr></tbody></table>', tableSelector);
      }

      if (globalFields.settings.selected_table == "table3") {
          TableHeadHtml('<table class="ac__settings__table ac_table3" id="ac_table3"><tbody class="ac__tbody"><tr class="ac__tr ac__tr1"><th class="ac__th ac__th1">' + globalFields.settings.table_headers.header1_value + '</th><th class="ac__th ac__th2" >' + globalFields.settings.table_headers.header2_value + '</th><th class="ac__th ac__th3">' + globalFields.settings.table_headers.header3_value + '</th></tr></tbody></table>', tableSelector);
      }

      if (globalFields.settings.selected_table == "table4") {
          TableHeadHtml('<table class="ac__settings__table ac_table4" id="ac_table4"><tbody class="ac__tbody"></tbody></table>', tableSelector);
      }
  }

  var TableRowHtml = function (contentHtml, tableSelector) {
      jQuery(tableSelector).append(contentHtml);
  }

  var TableRowSingle = function (tieredMin_, tieredMax_, discountedPrice, tieredOff, index) {
      var plusSign = tieredMin_ == tieredMax_ ? '' : '+', buyText = 'Buy ';
      var priceHtml = '<span class="money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + discountedPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(discountedPrice, globalFields.amount) + '</span>';
      if (globalFields.settings.selected_table == "table1") {
          TableRowHtml('<tr class="ac__tr ac__tr' + (index + 1) + '"> <td class="ac__td ac__td1" >' + tieredMin_ + plusSign + '</td><td class="ac__td ac__td2" >' + tieredOff + '</td></tr>', '#ac_table1 .ac__tbody');
      }

      if (globalFields.settings.selected_table == "table2") {
          TableRowHtml('<tr class="ac__tr ac__tr' + (index + 1) + '"> <td class="ac__td ac__td1">' + tieredMin_ + '</td><td class="ac__td ac__td2" >' + tieredMax_ + '</td><td class="ac__td ac__td3">' + tieredOff + '</td></tr>', '#ac_table2 .ac__tbody');
      }

      if (globalFields.settings.selected_table == "table3") {
          TableRowHtml('<tr class="ac__tr ac__tr' + (index + 1) + '"> <td class="ac__td ac__td1">' + tieredMin_ + plusSign + '</td><td class="ac__td ac__td2" >' + priceHtml + '</td><td class="ac__td ac__td3">' + tieredOff + '</td></tr>', '#ac_table3 .ac__tbody');
      }

      if (globalFields.settings.selected_table == "table4") {
          var quantityTextTable4 = tieredMin_ + "-" + tieredMax_;
          if (tieredMax_ == "+") {
              quantityTextTable4 = tieredMin_ + "+";
          }
          TableRowHtml('<tr class="ac__tr ac__tr' + index + '"> <td class="ac__td ac__td1">' + globalFields.settings.table_body.body1_value + ' ' + tieredMin_ + ' ' + globalFields.settings.table_body.body2_value + ' ' + tieredOff + '</td></tr>', '#ac_table4');
      }


  }

  var WriteTableRows = function (tierObj, selectedVariant_) {
      var originalPrice_ = globalFieldsProductPage_AC.variantsPriceArray_PD[selectedVariant_]; originalPrice_ = originalPrice_ / 100;
      for (i = 0; i < tierObj.tier_min.length; i++) {
          var isBreakLoop = false, tieredOff = Number(tierObj.tier_values[i]);
          var tieredMin_ = parseInt(tierObj.tier_min[i]), tieredMax_ = tierObj.tier_max[i], discountedPrice = 0;

          if (tieredMax_ != "max") {
              tieredMax_ = parseInt(tieredMax_);
          }
          else {
              tieredMax_ = "+";
          }

          if (tierObj.discount_type == "percentage") {
              discountedPrice = Number(originalPrice_.toFixed(2));
              var p = parseFloat(tieredOff) / 100, originalPriceCut_ = Number(parseFloat(p * discountedPrice).toFixed(2));
              discountedPrice = discountedPrice - originalPriceCut_;
              if (discountedPrice <= 0) {
                  discountedPrice = 0;
                  tieredOff = "100%";
                  isBreakLoop = true;
                  tieredMax_ = "+";
              }
              else {
                  discountedPrice = discountedPrice.toFixed(2);
                  tieredOff = tieredOff + "% OFF";
              }
          }
          else if (tierObj.discount_type == "fixed_price") {
              discountedPrice = tieredOff.toFixed(2);
              tieredOff = globalFields.formatMoney(tieredOff.toFixed(2), globalFields.amount);
          }
          else {
              discountedPrice = Number((originalPrice_ - tieredOff).toFixed(2));
              if (discountedPrice <= 0) {
                  discountedPrice = 0;
                  tieredOff = globalFields.formatMoney(originalPrice_.toFixed(2), globalFields.amount);
                  isBreakLoop = true;
                  tieredMax_ = "+";
              }
              else {
                  discountedPrice = discountedPrice.toFixed(2);
                  tieredOff = globalFields.formatMoney(tieredOff.toFixed(2), globalFields.amount) + " OFF";
              }
          }

          TableRowSingle(tieredMin_, tieredMax_, discountedPrice, tieredOff, i + 1);

          if (isBreakLoop) { break; }
      }
  }

}

var globalFieldsProductPage_AC = new ACDiscountApp.PDPage.Global(), displayTiers = new ACDiscountApp.PDPage.DisplayTiers();
displayTiers.DisplayTiersFn(); displayTiers.OnVariantChange();