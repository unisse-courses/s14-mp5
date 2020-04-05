            // // Get current user
            // var urlParams = new URLSearchParams(window.location.search);
            // const user = urlParams.get('username');

            // Shopping cart expenses variable
            var expenses = [];
            var sum = parseFloat(0); // Total amount

            // Opening individual tabs function
            function openTab(evt, tabName) {
                var i, tabcontent, tablinks;
                tabcontent = document.getElementsByClassName("tabcontent");
                for (i = 0; i < tabcontent.length; i++) {
                    tabcontent[i].style.display = "none";
                }
                tablinks = document.getElementsByClassName("tablinks");
                for (i = 0; i < tablinks.length; i++) {
                    tablinks[i].className = tablinks[i].className.replace(" active", "");
                }
                document.getElementById(tabName).style.display = "block";
                evt.currentTarget.className += " active";
            }

            /** Shop Menu **/
            function menu(option) {
                let options = document.getElementsByClassName("options");
                for (i = 0; i < options.length; i++) {
                    options[i].style.display = "none";
                }

                if(option == "bulletinboard") {
                    $("#home").addClass("active");
                    $("#browse").removeClass("active");
                    $("#sell").removeClass("active");
                    $("#profile").removeClass("active");
                    $("#bulletinboard").css("display", "block");
                    $(".browse-wrapper").css("display", "none");
                    $(".sell-wrapper").css("display", "none");
                    $(".profile-wrapper").css("display", "none");

                    let tabcontent = document.getElementsByClassName("tabcontent");
                    for (i = 0; i < tabcontent.length; i++) {
                        tabcontent[i].style.display = "none";
                    }
                } else if(option == "items") {
                    $("#home").removeClass("active");
                    $("#browse").addClass("active");
                    $("#sell").removeClass("active");
                    $("#profile").removeClass("active");
                    $("#bulletinboard").css("display", "none");
                    $(".browse-wrapper").css("display", "block");
                    $("#items").css("display", "block");
                    $("#cart").css("display", "block");
                    $(".sell-wrapper").css("display", "none");
                    $(".profile-wrapper").css("display", "none");
                } else if(option == "sell") {
                    $("#home").removeClass("active");
                    $("#browse").removeClass("active");
                    $("#sell").addClass("active");
                    $("#profile").removeClass("active");
                    $("#bulletinboard").css("display", "none");
                    $(".browse-wrapper").css("display", "none");
                    $(".sell-wrapper").css("display", "block");
                    $("#inventory").css("display", "block");
                    $(".profile-wrapper").css("display", "none");
                } else if(option == "profile") {
                    $("#home").removeClass("active");
                    $("#browse").removeClass("active");
                    $("#sell").removeClass("active");
                    $("#profile").addClass("active");
                    $("#bulletinboard").css("display", "none");
                    $(".browse-wrapper").css("display", "none");
                    $(".sell-wrapper").css("display", "none");
                    $(".profile-wrapper").css("display", "block");

                    let tabcontent = document.getElementsByClassName("tabcontent");
                    for (i = 0; i < tabcontent.length; i++) {
                        tabcontent[i].style.display = "none";
                    }
                }
            }

            /** Add to Cart **/
            $("#addToCart").click(function() {
                var exp = new expense(/* INSERT ITEM DETAILS */);
                expenses.push(exp);

                let newItem = $("<div></div>");


                // var categ = /*$("#categField")*/.val();

                if(categ == "weapon")
                    newItem.attr("class", "expenseItem weapon");
                else if(categ == "armor")
                    newItem.attr("class", "expenseItem armor");
                else if(categ == "accessory")
                    newItem.attr("class", "expenseItem accessory");
                else if(categ == "material")
                    newItem.attr("class", "expenseItem material");

                var qty = $("<span></span>");
                qty.attr("class", "qtycol");
                qty.text($("#qty").val());

                var item = $("<span></span>");
                item.attr("class", "itemcol");
                item.text($("#item").val());

                var amt = parseFloat($("#amount").val());
                var newamt = amt.toFixed(2);
                var amount = $("<span></span>");
                amount.attr("class", "amountcol");
                amount.text(newamt);

                newItem.append(qty);
                newItem.append(item);
                newItem.append(amount);

                $("#list").append(newItem);

                sum = parseFloat(0);

                for(let i = 0; i < expenses.length; i++) {
                    sum = sum + parseFloat(expenses[i]['amount']);
                }

                $("#total").html(Number(sum).toFixed(2));
            })

            /** Reset Comment Box **/
            function resetCommentBox() {
                $("#commentBox").val("");
            }

            /** Post Comment **/
            function postComment() {
                let newComment = $("<div></div>")
                newComment.attr("class", "comment");

                let user = "Someone";
                let commenter = $("<h2></h2>")
                commenter.text(user);
                commenter.css("margin-top", "0px");
                commenter.css("display", "block");
                newComment.append(commenter);

                let comment = $("<div></div>")
                comment.text($("#commentBox").val());
                newComment.append(comment);

    			$("#comments").append(newComment);
                resetCommentBox();
            }