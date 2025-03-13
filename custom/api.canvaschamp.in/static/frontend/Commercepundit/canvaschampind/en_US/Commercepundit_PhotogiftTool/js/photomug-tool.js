define([
    "jquery",
    "prototype",
    'SocialPopup',
    'fabric',
    'spectrum',
    'jqueryui',
    'jqueryuploadfile',
    'mCustomScrollbar',
    'jquerymalihuscrollbar',
    'jquerynicescroll',
    'owlCarousel',
    'lazyload',
    'popupoverlay',
    'slick',
    'fontfaceobserver',
    'html2canvas',
    'passwordStrengthIndicator',
    'touchPunch',
    'fabricCurvedText',
    'mage/backend/tabs'
], function($j, prototype, SocialPopup) {
    var designtoolPhotomug = Class.create();
    designtoolPhotomug.prototype = {
        options: {
            width: 400,
            height: 300,
            measurement: 'MM',
            canvasMaxWidth: 550,
            canvasMaxHeight: 550,
            canvasWidth: 550,
            canvasHeight: 550,
            hostUrl: '',
            type: 1,
            designId: 0,
            userId: 0,
            isEdit: 0,
            productId: 0,
            proofImages: [],
            svgImages: [],
            canvasDesignJson: [],
            photoMugDiv: null,
            currentCanvas: null,
            draggedImgSrc: null,
            currentObject: null,
            colorPaletteWidth: '14px',
            colorPaletteHeight: '12px',
            colorPaletteMargin: '0px 0px 0px 0px',
            pickerDefaultColor: '#000000',
            canvasDefaultBackgrounColor: null,
            copyCutobject: null,
            currentText: null,
            lazyLoaderContainer: {
                'upload': '.browse-images-list',
                'clipart': '.add-clip-art'
            },
            currentPrice: 0.00,
            discountPrice: 0.00,
            currentStep: '',
            /* new phase 2 parameter */
            boxLeft: 0,
            boxTop: 0,
            boxWidth: 0,
            boxHeight: 0,
            boxBorderColor: 'black',
            boxBorderColorWidth: 2,
            isLayout: 1,
            isSwap: 0,
            firstSwapObject: null,
            secondSwapObject: null,
            totalLoaderCalls: 0,
            priceElementsArray: [],
            layout: {},
            loginDialog: '',
            forgetPasswordDialog: '',
            registerDialog: '',
            saveDesignNameDialog: '',
            saveDesignSuccessDialog: '',
            loginFrm: '',
            registerFrm: '',
            forgotPasswordFrm: '',
            imageEditPanelDialog: '',
            removeDesignDialogConfirm: '',
            action: '',
            imgForEdited: null,
            imgForEditedCanvas: null,
            designerstudioLoginForm: null,
            designerstudioRegisterForm: null,
            designerstudioForgetPaswordForm: null,
            menuItems: [],
            currentMenuItemIndex: 0,
            maxCanvases: 12,
            addToCartBtnDisableCounter: 13,
            scale_factor: 1.02,
            clickToCart: false,
            clickToSaveDesign: false,
            fotoliaMessageShow: false,
            generalMessage: true,
            usedImages: {},
            showUsedImage: '',
            defaultTab: 'photomug_size',
            editBoxLeft: 0,
            editBoxTop: 0,
            currency: '',
            resetObject: null,
            activeBoxId: null,
            oldImage: null,
            uploadLinkClicked: true,
            windowWidth: $j(window).width(),
            editImageScaleRatio: 1,
            fontDetails: null,
            tabs: {
                'photomug_size': 'Select Mug',
                'upload': 'Upload',
                'photomug_palettes_option': 'Select Color',
                'layouts_panel': 'Select layout',
                'addtext': 'Add Text',
                'clipart': 'Select Clipart'
            }, //'themes_panel':'Select Theme',
            fontDetails: null,
            errorInSave: false,
            disableBold: false,
            disableItalic: false,
            disableBoldItalic: false,
            totalStockImagePrice: 0.00,
            totalStockImageCount: 0,
            defaultArcTextRadius: 100,
            defaultArcTextSpacing: 5,
            mugBgClass: ''
        },
        initialize: function(options) {
            var current = this;
            $j('body').addClass('photomug-tool');
            $j('.editorcontainer').show();
            current.options.currency = document.getElementById("currency").value;
            $j('#add_to_cart_btn').removeClass('disabled');
            $j('#oraganize_photobook').hide();
            $j('.hanger-hook,.add_event_box,#topcontrol,.fix-bar,.calendar-button-next,.style-color-apply-area').hide();
            $j('body').css('overflow', 'auto');

            if (current.options.windowWidth < 480) {
                $j(".photomug_size_menu a .mobile-replace").replaceWith("<span>Type</span>");
                $j(".photomug_palettes_option a .mobile-replace").replaceWith("<span>Color</span>");
                $j(".Upload a .mobile-replace").replaceWith("<span>Upload </span>");
                $j(".add-text a .mobile-replace").replaceWith("<span>Text</span>");
                $j(".layouts_menu a .mobile-replace").replaceWith("<span>Text</span>");
            }

            var $pop = $j('.menu-pop'),
                $modal = $j('.modal-frame');
            $overlay = $j('.modal-overlay');
            notHov = 1; // Hover flag

            $pop.hover(function() {
                notHov ^= 1;
            }); // Toggle flag on hover

            $j.each($j('.menulink'), function(index, objectId) {
                current.options.menuItems.push($j(objectId).attr('data-step'));
            });

            $j(document).on('mouseup keyup', function(e) {
                if (notHov || e.which == 27) $pop.fadeOut();
            });

            $j(".popover-effect").click(function() {
                $j(this).siblings('.menu-pop').slideToggle('1000', "swing");
            });

            /* Need this to clear out the keyframe classes so they dont clash with each other between ener/leave. Cheers. */
            $modal.bind('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
                if ($modal.hasClass('state-leave')) {
                    $modal.removeClass('state-leave');
                }
            });

            current.photoMugDiv = $j('#main_designtool_tool');
            current.options = $j.extend(current.options, options.mugToolKey);

            if (current.options.windowWidth < 500) {
                current.options.boxBorderColorWidth = 1;
            } else {
                current.options.boxBorderColorWidth = 2;
            }

            if (current.options.outofStockProduct == 1) {
                $j("#out-of-stock-pop").dialog({
                    width: 550,
                    autoOpen: true,
                    modal: true,
                    draggable: false,
                    resizable: false,
                    responsive: true,
                    dialogClass: 'no-close out-of-stock-pop'
                });
                current.hideLoader();
                $j('#initial_loader').hide();
                $j('#out-of-stock-pop').show();
            }
            if ($j('#font-details-json').length) {
                var fontJsonString = $j('#font-details-json').val();
                if (fontJsonString) {
                    try {
                        current.options.fontDetails = $j.parseJSON(fontJsonString);
                        //current.loadAllFonts();
                    } catch (e) {

                    }
                }
            }

            var selectionColor = '#bf1e2e';
            if (current.options.store == 'canvaschamp_au' || current.options.store == 'canvaschamp_nz' || current.options.store == 'canvaschamp_ca') {
                var selectionColor = '#125688';
            } else {
                var selectionColor = '#bf1e2e';
            }

            fabric.Object.prototype.set({
                transparentCorners: false,
                borderColor: selectionColor,
                cornerColor: selectionColor,
            });

            var socialPopup = new SocialPopup({
                fasebookUrl: current.options.facebookUrl,
                instagramUrl: current.options.instagramUrl
            });

            $j('.objectpanel').height($j(window).height() - 57);

            $j(".img-edit-panel").draggable({
                cursor: 'move',
                containment: ".stage"
            });
            $j(".edit-text").draggable({
                appendTo: 'body',
                cursor: 'move',
                containment: ".stage"
            });
            current.applyDraggable();
            current.applySlider();
            current.createCanvases();

            /* if (window.history && window.history.pushState) {
                window.history.pushState('forward', null, './#forward');
                $j(window).on('popstate', function() {
                    if (!$j("#fotolia_dialog").is(":visible")) {
                        window.history.go(-2);
                    }
                });
            } */

            window.addEventListener("beforeunload", function(e) {
                if (current.options.clickToCart || current.options.clickToSaveDesign || current.options.errorInSave) {
                    return;
                }
                var confirmationMessage = 'If you leave before saving, your changes will be lost.';
                (e || window.event).returnValue = confirmationMessage; //Gecko + IE
                return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
            });

            var settings = {
                url: current.options.hostUrl + "general-tool-function/index/uploadFile/",
                uploadStr: 'Upload',
                dragDropStr: "",
                dragDrop: true,
                fileName: "uploadart",
                maxFileSize: 26214400,
                allowedTypes: "jpg,jpeg,png,bmp",
                showDelete: false,
                returnType: "json",
                showProgress: true,
                showDone: false,
                sequential: true,
                fileCounterStyle: ") ",
                uploadQueueOrder: 'bottom',
                statusBarWidth: '100%',
                dragdropWidth: '100%',
                allowDuplicates: true,
                onSuccess: function(files, data, xhr, pd) {
                    pd.statusbar.hide();
                    if (data['error'] == 0) {

                        if (current.options.uploadLinkClicked) {
                            current.options.draggedImgSrc = data['image'];
                            current.dropImageInBox(current.options.draggedImgSrc, current.options.activeBoxId + '_image', current.options.boxLeft, current.options.boxTop, current.options.boxWidth, current.options.boxHeight, '');
                        }

                        current.uploadedImageSlider('addItem', '<ul id="draggable"><li><a class="draggable-img" href="javascript:void(0);"><img class="draggable" src=' + data['image'] + ' width="70"></a><a href="javascript:void(0);" class="delete" ><i class="fa fa-times" aria-hidden="true"></i></a></li></ul>');
                        current.applyLazyLoader(current.options.lazyLoaderContainer.upload);
                        current.applyDraggable();
                    } else {
                        alert(data['message']);
                    }
                },
                deleteCallback: function(data, pd) {
                    for (var i = 0; i < data.length; i++) {
                        $j.post("delete.php", {
                                op: "delete",
                                name: data[i]
                            },
                            function(resp, textStatus, jqXHR) {
                                $j("#status").append("<div>File Deleted</div>");
                            });
                    }
                    pd.statusbar.hide(); //You choice to hide/not.
                },
                onSelect: function(files) {
                    current.addScrollBar('ajax-file-upload-container');
                    // $j(".bg-color-photoblanket").mCustomScrollbar('destroy');
                    setTimeout(function() {
                        $j(".ajax-file-upload-error").hide('blind', {}, 500)
                    }, 5000);
                }
            }

            current.colorPicker('#canvas-background-color-picker', 'canvasBackground');
            current.colorPicker('#text-color', 'text');
            current.selectDefaultValues();

            $j("#month-list").selectmenu();
            setTimeout(function() {
                $j("#textFontSize").selectmenu();
            }, 2000);

            if (!current.options.isEdit) {
                current.createPhotoMug();
            } else {
                current.loadEditCaseJson();
            }

            $j(document).on('mousedown', 'img.draggable', function(e) {
                current.dragUploadImage(this);
            });

            $j(document).on('click', '#fotolia_popup_right img', function() {
                current.fotoliaCategoryClickEvent(this);
            });

            var uploadObj = $j("#multiplefileuploader").uploadFile(settings);

            $j(document).on('click', '.Upload', function() {
                current.applyLazyLoader(current.options.lazyLoaderContainer.upload);
            });

            $j(document).on('click', '#left_rotate,#right_rotate', function() {
                current.manageImageOnEditCanvasRotation(this);
            });

            $j(document).on('click', '#zoom-out', function() {
                current.zoomOutNew(this);
            });

            $j(document).on('click', '#zoom-in', function() {
                current.zoomInNew(this);
            });

            $j(document).on('click', '.menulink', function() {
                var indexOfClickedMenu = current.options.menuItems.indexOf($j(this).attr('data-step'));
                $j('.results.' + $j(this).attr('data-step')).removeClass('sliding-up');
                $j('.results.' + $j(this).attr('data-step')).removeClass('sliding-down');

                if (current.options.currentMenuItemIndex < indexOfClickedMenu) {
                    $j('.results.' + $j(this).attr('data-step')).addClass('sliding-down');
                } else if (current.options.currentMenuItemIndex > indexOfClickedMenu) {
                    $j('.results.' + $j(this).attr('data-step')).addClass('sliding-up');
                } else {
                    $j('.results.' + $j(this).attr('data-step')).addClass('sliding-down');
                }

                current.openTab($j(this).attr('data-step'));
                current.options.currentMenuItemIndex = current.options.menuItems.indexOf($j(this).attr('data-step'));
                current.applyLazyLoader(current.options.lazyLoaderContainer.upload);
            });

            $j(document).on('click', '.upload-from-image-gallery', function() {
                current.openFotoliaPopup();
            });

            $j(document).on('click', '.upload-from-computer', function() {
                $j('input[type=file]').trigger("click");
                current.options.uploadLinkClicked = false;
            });

            $j(document).on('click', '.uplaod-from-facebook', function() {
                socialPopup.openFacebookPopup(this);
                return false;
            });

            $j(document).on('click', '.upload-from-instagram', function() {
                socialPopup.openInstagramPopup(this);
                return false;
            });

            $j(document).keydown(function(e) {
                current.documentKeyDownEvent(e);
            });

            $j(document).on('click', '#preview', function() {
                $overlay.addClass('state-show');
                $modal.removeClass('state-leave').addClass('state-appear');
                $j('.modal-body').addClass('mug-perview-scroll mCustomScrollbar');
                current.addScrollBar('mCustomScrollbar');
                $j('.preview-image').empty();

                if (current.options.defaultValues.photomugType.value == "magic_photomug") {
                    $j("#selected_type").html("Magic Mug");
                    division = $j('<img src="' + current.options.skinUrl + 'photomug/magic-mug-preview.gif" />');
                    division.appendTo('.preview-image');
                } else if (current.options.defaultValues.photomugType.value == "heart_handle_red_magic_photomug") {
                    $j("#selected_type").html("Heart Handle Red Magic Mug");
                    division = $j('<img src="' + current.options.skinUrl + 'photomug/heart-handle-red-magic-mug-preview.png" />');
                    division.appendTo('.preview-image');
                } else if (current.options.defaultValues.palette_color.value == "cut_heart_red") {
                    $j("#selected_type").html("Cut Heart Handle Magic Mug");
                    division = $j('<img src="' + current.options.skinUrl + 'photomug/cut-heart-handle-red-magic-mug-preview.png" />');
                    division.appendTo('.preview-image');
                } else if (current.options.defaultValues.palette_color.value == "cut_heart_black") {
                    $j("#selected_type").html("Cut Heart Handle Magic Mug");
                    division = $j('<img src="' + current.options.skinUrl + 'photomug/cut-heart-handle-black-magic-mug-preview.png" />');
                    division.appendTo('.preview-image');
                } else if (current.options.defaultValues.photomugType.value == "golden_photomug" ||
                    current.options.defaultValues.photomugType.value == "silver_photomug") {
                    $j("#selected_type").html("");
                    division = $j('<div class="preview-msg"> Realistic Preview is not generated for Golden and Silver Mug.</div>');
                    division.appendTo('.preview-image');
                } else if (current.options.defaultValues.photomugType.value == "beer_photomug") {
                    $j("#selected_type").html("Beer Mug");
                    if (current.options.currentCanvas) {
                        for (var i = 1; i <= 3; i++) {
                            division = $j('<canvas id="previewcanvas_' + i + '"></canvas>');
                            division.appendTo('.preview-image');
                        }
                        current.loadPreviewBeerMug1();
                        current.loadPreviewBeerMug2();
                        current.loadPreviewBeerMug3();
                        if (current.options.windowWidth < 768) {
                            $j('.preview-image canvas').css('width', 250)
                        }
                    }
                } else if (current.options.defaultValues.photomugType.value == "frosted_photomug") {
                    $j("#selected_type").html("Frosted Mug");
                    if (current.options.currentCanvas) {
                        for (var i = 1; i <= 3; i++) {
                            division = $j('<canvas id="previewcanvas_' + i + '"></canvas>');
                            division.appendTo('.preview-image');
                        }
                        current.loadPreviewFrostedMug1();
                        current.loadPreviewFrostedMug2();
                        current.loadPreviewFrostedMug3();
                        if (current.options.windowWidth < 768) {
                            $j('.preview-image canvas').css('width', 250)
                        }
                    }
                } else if (current.options.defaultValues.photomugType.value == "tea_photomug") {
                    $j("#selected_type").html("Tea Mug");
                    if (current.options.currentCanvas) {
                        for (var i = 1; i <= 3; i++) {
                            division = $j('<canvas id="previewcanvas_' + i + '"></canvas>');
                            division.appendTo('.preview-image');
                        }
                        current.loadPreviewTeaMug1();
                        current.loadPreviewTeaMug2();
                        current.loadPreviewTeaMug3();
                        if (current.options.windowWidth < 768) {
                            $j('.preview-image canvas').css('width', 250)
                        }
                    }
                } else if (current.options.defaultValues.photomugType.value == "heart_handle_white_photomug") {
                    $j("#selected_type").html("Heart Handle White Mug");
                    if (current.options.currentCanvas) {
                        for (var i = 1; i <= 3; i++) {
                            division = $j('<canvas id="previewcanvas_' + i + '"></canvas>');
                            division.appendTo('.preview-image');
                        }
                        current.loadPreviewHeartHandleWhiteMug1();
                        current.loadPreviewHeartHandleWhiteMug2();
                        current.loadPreviewHeartHandleWhiteMug3();
                        if (current.options.windowWidth < 768) {
                            $j('.preview-image canvas').css('width', 250)
                        }
                    }
                } else if (current.options.defaultValues.photomugType.value == "cut_heart_handle_white_photomug") {
                    $j("#selected_type").html("Cut Heart Handle White Mug");
                    if (current.options.currentCanvas) {
                        for (var i = 1; i <= 3; i++) {
                            division = $j('<canvas id="previewcanvas_' + i + '"></canvas>');
                            division.appendTo('.preview-image');
                        }
                        current.loadPreviewCutHeartHandleWhiteMug1();
                        current.loadPreviewCutHeartHandleWhiteMug2();
                        current.loadPreviewCutHeartHandleWhiteMug3();
                        if (current.options.windowWidth < 768) {
                            $j('.preview-image canvas').css('width', 250)
                        }
                    }
                } else {
                    $j("#selected_type").html("Standard Mug");
                    if (current.options.currentCanvas) {
                        for (var i = 1; i <= 3; i++) {
                            division = $j('<canvas id="previewcanvas_' + i + '"></canvas>');
                            division.appendTo('.preview-image');
                        }
                        current.loadPreviewCanvas1();
                        current.loadPreviewCanvas2();
                        current.loadPreviewCanvas3();

                        if (current.options.windowWidth < 768) {
                            $j('.preview-image canvas').css('width', 250)
                        }
                    }
                }
            });

            $j(document).on('click', '.close', function() {
                $overlay.removeClass('state-show');
                $modal.removeClass('state-appear').addClass('state-leave');
            });

            $j(document).on('keyup', '#text2', function() {
                if ($j('#text2').val().length > 0) {
                    current.addTextInCanvas(this);
                } else if (current.options.currentObject && (current.options.currentObject.type == 'text' || current.options.currentObject.type == 'curvedText')) {
                    current.deleteObject();
                }
            });

            $j('#text2').bind("paste", function(e) {
                alert('Paste is not allowed');
                e.preventDefault();
                return false;
            });

            $j(document).on('change', '#background-color-checkbox', function() {
                if ($j('#canvas-background-color-picker').val() == '') {
                    var backgroundColor = current.canvasDefaultBackgrounColor;
                } else {
                    var backgroundColor = $j('#canvas-background-color-picker').val();
                }
                current.changeMugBackgroundColor(backgroundColor);
            });

            if ($j('.browse-images-list img').length > 0) {
                $j('.browse-images').show();
            }

            $j(document).on('click', '#clipart_list li a', function() {
                var svgSrc = $j(this).attr('svgsrc');
                if (svgSrc) {
                    current.addClipart(svgSrc);
                }
            });

            $j(document).on('click', '.add-to-cart-btn,.addtocart', function() {
                current.options.action = 'addtocart';
                current.collectSVGProofImages();
            });

            $j("#textFontFamily").selectmenu({
                open: function() {
                    $j('div.ui-selectmenu-menu li.ui-menu-item').each(function() {
                        $j(this).css("font-family", $j(this).text());
                    })
                }
            });

            $j("#textFontSize").on("selectmenuchange", function(event, ui) {
                current.fontSizeChangeEvent(this);
            });

            $j("#textFontFamily").on("selectmenuchange", function(event, ui) {
                current.fontFamilyChangeEvent(this);
            });

            $j(document).on('click', '.mug_sizes,.cut_heart_color', function() {
                var element = this;
                if (!$j(this).hasClass('active')) {
                    if ($j(this).hasClass('cut_heart_color')) {
                        $j("#remove_design_confirm").html('Once you change mug color, all your design will be lost. Are you sure?');
                    } else {
                        $j("#remove_design_confirm").html('Once you change mug type, all your design will be lost. Are you sure?');
                    }
                    $j("#remove_design_confirm").dialog({
                        resizable: false,
                        height: "auto",
                        width: 400,
                        modal: true,
                        buttons: [{
                                text: "Yes",
                                class: "btn confirm",
                                click: function() {
                                    $j(this).dialog("close");
                                    current.resetCanvas(element);
                                }
                            },
                            {
                                text: "No",
                                class: "btn not_confirm",
                                click: function() {
                                    $j(this).dialog("close");
                                }
                            }
                        ],
                        close: function(event, ui) {
                            $j(this).dialog("close");
                        }
                    });
                }
            });

            $j(document).on("click", "#textBold", function() {
                current.textBoldClickEvent(this, $j("#textFontFamily").val());
            });

            $j(document).on("click", "#textItalic", function() {
                current.textItalicClickEvent(this, $j("#textFontFamily").val());
            });

            $j(document).on("click", "#textUnderline", function() {
                current.textUnderlineClickEvent(this);
            });

            $j(document).on("click", "#textOveline", function() {
                current.textOvelineClickEvent(this);
            });

            $j(document).on("click", ".text-align a", function() {
                current.textAlignClickEvent(this);
            });

            // ARC TEXT :BEGIN
            $j(document).on('keydown', '#angle_text', function(e) {
                current.setTextAngle(e);
            });

            $j(document).on('click', '#arcText', function(e) {
                current.arcTextClicKEvent(e);
            });

            $j(document).on('click', '#reverseText', function(e) {
                current.arcTextReverseClickEvent(e);
            });

            $j('#radius').attr('max', parseInt(current.options.canvasMaxWidth / 2));
            current.setArcRadiusSpacingValue('.arc-range-value', '#radius');
            current.setArcRadiusSpacingValue('.latter-spacing-range-value', '#spacing');

            $j(document).on('input change', '#radius, #spacing', function(e) {
                current.arcTextRadiusSpacing(e);
            });
            // ARC TEXT :END

            $j(document).on("click", ".text-link", function() {
                current.removeBackgroundColor();
            });

            $j(document).on('click', '#save_design', function() {
                if ($j('#design_name').val() == '' && $j('#user_id').val() != '') {
                    current.options.action = 'save_design';
                    current.options.saveDesignNameDialog.dialog('open');
                } else {
                    current.saveDesign();
                }
            });

            $j(document).on("click", ".close_left_panel", function() {
                $j("#slide-stage").animate({
                    marginLeft: "90px"
                }, 500);
                $j(".print-detail").animate({
                    "width": "100%"
                }, 500);
                $j("#left-menu").animate({
                    marginLeft: "-330px"
                }, 500);
                current.options.currentStep = '';
                $j(".menulink").removeClass('active');
                $j('.results').hide();
                $j('.close_panel').hide();
                current.options.currentMenuItemIndex = 0;
            });

            $j(document).on("click touchend", ".layout_image", function() {
                if (!longtouch) {
                    if (!($j(this).hasClass('active')))
                        current.checkLayoutTypeChange(this);
                }
                longtouch = false;
                clearTimeout(timeout);
            });

            current.setPrice(0, 0, current.options.defaultValues.size.value);
            current.bindJSEvents();

            $j(document).on('click', '.register-link', function() {
                current.options.loginDialog.dialog('close');
                current.options.forgetPasswordDialog.dialog('close');
                current.options.registerDialog.dialog('open');
            });

            $j(document).on('click', '.login-link', function() {
                current.options.registerDialog.dialog('close');
                current.options.forgetPasswordDialog.dialog('close');
                current.options.loginDialog.dialog('open');
            });

            $j(document).on('click', '.forget-password-link', function() {
                current.options.registerDialog.dialog('close');
                current.options.loginDialog.dialog('close');
                current.options.forgetPasswordDialog.dialog('open');
            });

            $j(document).on('click', '#save_design_btn', function() {
                current.options.userId = $j('#user_id').val();
                current.collectSVGProofImages();
                current.options.saveDesignNameDialog.dialog('close');
            });

            if (current.options.designId != '') {
                current.selectAccordian('.layouts_accordion', '.layout_categories', 'layout_category_' + current.options.defaultValues.layout.defaultLayoutCategory);
            }

            $j(document).on('click', '#bottom-scroll', function() {
                $j('html,body').animate({
                    scrollTop: $j(document).height()
                }, 600);
                return false;
            });

            $j(document).on('click', '#top-scroll', function() {
                $j("html, body").animate({
                    scrollTop: 0
                }, 600);
                return false;
            });

            $j(document).on('click', '#ok_for_edit_img', function() {
                current.updateEditedImage();
            });

            $j(document).on('click', '#close_for_edit_img', function() {
                current.options.imageEditPanelDialog.dialog('close');
                current.options.imgForEdited = null;
            });

            $j(document).on('click', '.cancel_edit', function() {
                if (current.options.currentObject && current.options.currentObject != null && (current.options.currentObject.type == 'text' || current.options.currentObject.type == 'curvedText') && current.options.currentObject.id)
                    current.deleteObject();
            });

            $j("body").click(function(e) {
                if (!$j(e.target).parents().hasClass('canvas-container') &&
                    !$j(e.target).parents().hasClass('img-edit-panel') &&
                    !$j(e.target).parents().hasClass('ui-dialog-content') &&
                    !$j(e.target).hasClass('ui-widget-overlay') &&
                    !$j(e.target).parents().hasClass('addtext') &&
                    !$j(e.target).parents().hasClass('ui-selectmenu-menu') &&
                    !$j(e.target).parents().hasClass('edit-text') &&
                    !$j('#image_edit_panel').is(':visible') &&
                    !$j(e.target).hasClass('edit-text')) {
                    current.options.currentCanvas.deactivateAllWithDispatch();
                    current.options.currentCanvas.renderAll();
                }
            });

            current.disableImageEditOptions();
            current.uploadedImageSlider();
            current.storeUsedImagesOnLoad();
            current.EnableDisableAddtoCart();

            $j('#id-name--1').on('click', function() {
                if ($j(this).is(':checked') == true) {
                    current.hideShowUsedImages(true);
                } else {
                    current.hideShowUsedImages(false, true);
                }
            });
            $j('#design_name').val(current.options.designName);

            if (current.options.windowWidth > 1024) {
                current.openTab(current.options.defaultTab);
                $j('.layouts-scrollwrap').css("height", 440);
            } else {
                current.openTab('upload');
                $j('.layouts-scrollwrap').css("height", 315);
            }

            $j('.switch_tabs').on('click', function() {
                current.openTab($j(this).attr('data-val'));
            });

            $j(document).on('click', '.mug_color_link', function() {
                current.changeMugColor($j(this).attr('name'));
            });

            $j(document).on('click', '#reset_for_edit_img', function() {
                current.editImageInPopup();
            });

            $j(document).on('click', '.demo-image', function() {
                current.setActiveBox(this);
                current.demoImageClickEvent(this);
            });

            $j(document).on('click', 'input[type=file]', function(e) {
                if (typeof e.originalEvent === 'undefined') {
                    current.options.uploadLinkClicked = true;
                } else {
                    current.options.uploadLinkClicked = false;
                }
            });

            var timeout, longtouch = false;
            $j(document).on('touchstart', '#image_edit,#swapImage,#delete,.edit-text,#bg_edit', function(e) {
                timeout = setTimeout(function() {
                    longtouch = true;
                }, 200);
            });

            $j(document).on('click touchend', '#delete,.edit-text', function(e) {
                if (!longtouch) {
                    current.deleteObject();
                }
                longtouch = false;
                clearTimeout(timeout);
            });

            $j(document).on('click touchend', '#swapImage', function() {
                if (!longtouch) {
                    current.options.isSwap = 1;
                }
                longtouch = false;
                clearTimeout(timeout);
            });

            $j(document).on('click touchend', '#image_edit', function(e) {
                if (!longtouch) {
                    current.options.isSwap = 0;
                    if (current.options.currentObject && current.options.currentObject.type == 'image') {
                        $j('#img-edit-panel').show();
                        current.editImageInPopup();
                    } else {
                        $j('#img-edit-panel').hide();
                        current.options.imgForEdited = null;
                    }
                }
                longtouch = false;
                clearTimeout(timeout);
            });

            $j(document).on('click touchend', 'li>a.delete', function(e) {
                var imgsrc = $j(this).closest('li').find('a.draggable-img').children().attr('src');
                current.deleteImage(this, imgsrc);
            });

            $j("#month-list").on("selectmenuchange", function(event, ui) {
                current.loadSelectedEffect($j(this).val());
            });

            $j('#initial_loader').hide();
        },

        loadRequiredFonts: function() {
            var current = this;
            if (Object.keys(current.options.usedFonts).length > 0) {
                current.loadAllReqFonts();
            }
        },
        loadAllReqFonts: function() {
            var current = this;
            if (current.options.usedFonts) {
                $j.each(current.options.usedFonts, function(idx, fontCombo) {
                    if (fontCombo['n']) {
                        var nFont = new FontFaceObserver(fontCombo['n']);
                        nFont.load().then(function() {
                            if (current.options.currentCanvas) {
                                current.options.currentCanvas.renderAll();
                            }
                        });
                    }

                    if (fontCombo['b']) {
                        var bFont = new FontFaceObserver(fontCombo['b']);
                        bFont.load().then(function() {
                            if (current.options.currentCanvas) {
                                current.options.currentCanvas.renderAll();
                            }
                        });
                    }

                    if (fontCombo['i']) {
                        var iFont = new FontFaceObserver(fontCombo['i']);
                        iFont.load().then(function() {
                            if (current.options.currentCanvas) {
                                current.options.currentCanvas.renderAll();
                            }
                        });
                    }

                    if (fontCombo['bi']) {
                        var biFont = new FontFaceObserver(fontCombo['bi']);
                        biFont.load().then(function() {
                            if (current.options.currentCanvas) {
                                current.options.currentCanvas.renderAll();
                            }
                        });
                    }
                });
            }
        },
        loadAllFonts: function() {
            var current = this;

            if (current.options.fontDetails) {
                $j.each(current.options.fontDetails, function(idx, fontCombo) {
                    if (fontCombo['n']) {
                        var nFont = new FontFaceObserver(fontCombo['n']);
                        nFont.load().then(function() {
                            if (current.options.currentCanvas) {
                                current.options.currentCanvas.renderAll();
                            }
                        });
                    }

                    if (fontCombo['b']) {
                        var bFont = new FontFaceObserver(fontCombo['b']);
                        bFont.load().then(function() {
                            if (current.options.currentCanvas) {
                                current.options.currentCanvas.renderAll();
                            }
                        });
                    }

                    if (fontCombo['i']) {
                        var iFont = new FontFaceObserver(fontCombo['i']);
                        iFont.load().then(function() {
                            if (current.options.currentCanvas) {
                                current.options.currentCanvas.renderAll();
                            }
                        });
                    }

                    if (fontCombo['bi']) {
                        var biFont = new FontFaceObserver(fontCombo['bi']);
                        biFont.load().then(function() {
                            if (current.options.currentCanvas) {
                                current.options.currentCanvas.renderAll();
                            }
                        });
                    }
                });
            }
        },
        applyFontStyleWeight: function(fontName, fontStyle, fontWeight) {
            var current = this;
            if (current.options.currentObject && (current.options.currentObject.type == 'text' || current.options.currentObject.type == 'curvedText')) {
                var fontObserv = new FontFaceObserver(fontName);

                fontObserv.load().then(function() {
                    current.options.currentObject.setFontFamily(fontName);
                    if (fontStyle != '') {
                        current.options.currentObject.setFontStyle(fontStyle);
                        current.options.currentObject.canvas.renderAll();
                    }
                    if (fontWeight != '') {
                        current.options.currentObject.setFontWeight(fontWeight);
                        current.options.currentObject.canvas.renderAll();
                    }
                    current.options.currentObject.canvas.renderAll();
                    current.options.currentCanvas.renderAll();
                    current.applyFontAccordingStyle();
                });
            }
        },
        loadSpecificFont: function(fontName, Canvas) {
            var current = this;
            fontName = fontName.replace('_bi', '');
            fontName = fontName.replace('_b', '');
            fontName = fontName.replace('_i', '');

            if (current.options.fontDetails && current.options.fontDetails[fontName]) {
                if (current.options.fontDetails[fontName]['n']) {
                    var nFont = new FontFaceObserver(current.options.fontDetails[fontName]['n']);
                    nFont.load().then(function() {
                        if (current.options.currentCanvas) {
                            current.options.currentCanvas.renderAll();
                        }
                        if (Canvas) {
                            Canvas.renderAll();
                        }
                    });
                }

                if (current.options.fontDetails[fontName]['b']) {
                    var bFont = new FontFaceObserver(current.options.fontDetails[fontName]['b']);
                    bFont.load().then(function() {
                        if (current.options.currentCanvas) {
                            current.options.currentCanvas.renderAll();
                        }
                        if (Canvas) {
                            Canvas.renderAll();
                        }
                    });
                }

                if (current.options.fontDetails[fontName]['i']) {
                    var iFont = new FontFaceObserver(current.options.fontDetails[fontName]['i']);
                    iFont.load().then(function() {
                        if (current.options.currentCanvas) {
                            current.options.currentCanvas.renderAll();
                        }
                        if (Canvas) {
                            Canvas.renderAll();
                        }
                    });
                }

                if (current.options.fontDetails[fontName]['bi']) {
                    var biFont = new FontFaceObserver(current.options.fontDetails[fontName]['bi']);
                    biFont.load().then(function() {
                        if (current.options.currentCanvas) {
                            current.options.currentCanvas.renderAll();
                        }
                        if (Canvas) {
                            Canvas.renderAll();
                        }
                    });
                }
            }
        },
        loadSpecificBoldFont: function(fontName) {
            var current = this;
            fontName = fontName.replace('_bi', '');
            fontName = fontName.replace('_b', '');
            fontName = fontName.replace('_i', '');
            if (current.options.fontDetails && current.options.fontDetails[fontName]) {
                if (current.options.fontDetails[fontName]['b']) {
                    var bFont = new FontFaceObserver(current.options.fontDetails[fontName]['b']);
                    bFont.load().then(function() {
                        if (current.options.currentCanvas) {
                            current.options.currentCanvas.renderAll();
                            current.options.disableBold = false;
                            $j("#textBold").closest('a').removeClass('disabled');
                            if (current.options.currentObject.fontWeight == 'bold') {
                                if (current.options.fontDetails[fontName]['bi']) {
                                    setTimeout(current.applyFontStyleWeight(fontName, '', 'bold'), 300);
                                } else if (current.options.fontDetails[fontName]['bi'] == null && (current.options.fontDetails[fontName]['i'] == null || current.options.currentObject.fontStyle != 'italic')) {
                                    setTimeout(current.applyFontStyleWeight(fontName, '', 'bold'), 300);
                                } else {
                                    setTimeout(current.applyFontStyleWeight(fontName, '', 'normal'), 300);
                                    $j("#textBold").closest('a').removeClass('active');
                                }
                            } else {
                                setTimeout(current.applyFontStyleWeight(fontName, '', 'normal'), 300);
                                $j("#textBold").closest('a').removeClass('active');
                            }
                            current.loadSpecificItalicFont(fontName);
                        }
                    });
                } else {
                    current.options.disableBold = true;
                    setTimeout(current.applyFontStyleWeight(fontName, '', 'normal'), 300);
                    $j("#textBold").closest('a').removeClass('active');
                    $j("#textBold").closest('a').addClass('disabled');
                    setTimeout(current.loadSpecificItalicFont(fontName), 300);
                }
            }
        },
        loadSpecificItalicFont: function(fontName) {
            var current = this;
            fontName = fontName.replace('_bi', '');
            fontName = fontName.replace('_b', '');
            fontName = fontName.replace('_i', '');
            if (current.options.fontDetails && current.options.fontDetails[fontName]) {
                if (current.options.fontDetails[fontName]['i']) {
                    var iFont = new FontFaceObserver(current.options.fontDetails[fontName]['i']);
                    iFont.load().then(function() {
                        if (current.options.currentCanvas) {
                            current.options.currentCanvas.renderAll();
                            current.options.disableItalic = false;
                            $j("#textItalic").closest('a').removeClass('disabled');
                            if (current.options.currentObject.fontStyle == 'italic') {
                                if (current.options.fontDetails[fontName]['bi']) {
                                    setTimeout(current.applyFontStyleWeight(fontName, 'italic', ''), 300);
                                } else if (current.options.fontDetails[fontName]['bi'] == null && (current.options.fontDetails[fontName]['bi'] == null || current.options.currentObject.fontWeight != 'bold')) {
                                    setTimeout(current.applyFontStyleWeight(fontName, 'italic', ''), 300);
                                } else {
                                    setTimeout(current.applyFontStyleWeight(fontName, 'normal', ''), 300);
                                    $j("#textItalic").closest('a').removeClass('active');
                                }
                            } else {
                                setTimeout(current.applyFontStyleWeight(fontName, 'normal', ''), 300);
                                $j("#textItalic").closest('a').removeClass('active');
                            }
                            current.loadSpecificBoldItalicFont(fontName);
                        }
                    });
                } else {
                    current.options.disableItalic = true;
                    setTimeout(current.applyFontStyleWeight(fontName, 'normal', ''), 300);
                    $j("#textItalic").closest('a').removeClass('active');
                    $j("#textItalic").closest('a').addClass('disabled');
                    setTimeout(current.loadSpecificBoldItalicFont(fontName), 300);
                }
            }
        },
        loadSpecificBoldItalicFont: function(fontName) {
            var current = this;
            fontName = fontName.replace('_bi', '');
            fontName = fontName.replace('_b', '');
            fontName = fontName.replace('_i', '');
            if (current.options.fontDetails && current.options.fontDetails[fontName]) {
                if (current.options.fontDetails[fontName]['bi']) {
                    var biFont = new FontFaceObserver(current.options.fontDetails[fontName]['bi']);
                    biFont.load().then(function() {
                        if (current.options.currentCanvas) {
                            current.options.currentCanvas.renderAll();
                            current.options.disableBoldItalic = false;
                            $j("#textBold").closest('a').removeClass('disabled');
                            $j("#textItalic").closest('a').removeClass('disabled');
                            if (current.options.currentObject.fontStyle == 'italic' && current.options.currentObject.fontWeight == 'bold') {
                                setTimeout(current.applyFontStyleWeight(fontName, 'italic', 'bold'), 300);
                            } else {
                                setTimeout(current.applyFontStyleWeight(fontName, '', ''), 300);
                            }
                        }
                    });
                } else {
                    current.options.disableBoldItalic = true;
                    if (current.options.disableBold == true && current.options.disableItalic == true) {
                        setTimeout(current.applyFontStyleWeight(fontName, 'normal', 'normal'), 300);
                        $j("#textBold").closest('a').removeClass('active');
                        $j("#textItalic").closest('a').removeClass('active');
                        $j("#textBold").closest('a').addClass('disabled');
                        $j("#textItalic").closest('a').addClass('disabled');
                    }
                }
            }
        },
        demoImageClickEvent: function(el) {
            var current = this;
            current.openTab('upload');
            $j('input[type=file]').trigger("click");
        },
        manageImageOnEditCanvasRotation: function(element) {
            var current = this;
            if (current.options.imgForEdited && current.options.imgForEditedCanvas) {
                if (element.id && element.id == 'right_rotate') {
                    if (current.options.imgForEdited.getAngle() == 0) {
                        current.options.imgForEdited.setAngle(90);
                    } else if (current.options.imgForEdited.getAngle() == 90) {
                        current.options.imgForEdited.setAngle(180);
                    } else if (current.options.imgForEdited.getAngle() == 180) {
                        current.options.imgForEdited.setAngle(270);
                    } else if (current.options.imgForEdited.getAngle() == 270) {
                        current.options.imgForEdited.setAngle(0);
                    }
                } else if (element.id && element.id == 'left_rotate') {
                    if (current.options.imgForEdited.getAngle() == 0) {
                        current.options.imgForEdited.setAngle(270);
                    } else if (current.options.imgForEdited.getAngle() == 270) {
                        current.options.imgForEdited.setAngle(180);
                    } else if (current.options.imgForEdited.getAngle() == 180) {
                        current.options.imgForEdited.setAngle(90);
                    } else if (current.options.imgForEdited.getAngle() == 90) {
                        current.options.imgForEdited.setAngle(0);
                    }
                }

                if (current.options.imgForEdited.getAngle() == 0) {
                    var imgHeight = current.options.imgForEdited.height;
                    var imgWidth = current.options.imgForEdited.width;

                    var ratioOfHeight = imgHeight / current.options.imgForEditedCanvas.height;
                    var ratioOfWidth = imgWidth / current.options.imgForEditedCanvas.width;

                    if (ratioOfHeight >= ratioOfWidth) {
                        current.options.imgForEdited.set({
                            scaleX: 1 / ratioOfWidth,
                            scaleY: 1 / ratioOfWidth
                        });
                    } else {
                        current.options.imgForEdited.set({
                            scaleX: 1 / ratioOfHeight,
                            scaleY: 1 / ratioOfHeight
                        });
                    }

                    if (current.options.imgForEdited.top > 0) {
                        current.options.imgForEdited.top = 0;
                    }

                    if (current.options.imgForEdited.left > 0) {
                        current.options.imgForEdited.left = 0;
                    }

                    if (current.options.imgForEdited.left < 0) {
                        var objWidth = current.options.imgForEdited.width * current.options.imgForEdited.scaleX;
                        var leftDiff = objWidth + current.options.imgForEdited.left;

                        if (leftDiff < current.options.imgForEditedCanvas.width) {
                            current.options.imgForEdited.left = current.options.imgForEditedCanvas.width - objWidth;
                            current.options.imgForEditedCanvas.renderAll();
                        }
                    }

                    if (current.options.imgForEdited.top < 0) {
                        var objHeight = current.options.imgForEdited.height * current.options.imgForEdited.scaleY;
                        var topDiff = objHeight + current.options.imgForEdited.top;

                        if (topDiff < current.options.imgForEditedCanvas.height) {
                            current.options.imgForEdited.top = current.options.imgForEditedCanvas.height - objHeight;
                            current.options.imgForEditedCanvas.renderAll();
                        }
                    }
                } else if (current.options.imgForEdited.getAngle() == 90) {

                    var imgHeight = current.options.imgForEdited.width;
                    var imgWidth = current.options.imgForEdited.height;

                    var ratioOfHeight = imgHeight / current.options.imgForEditedCanvas.height;
                    var ratioOfWidth = imgWidth / current.options.imgForEditedCanvas.width;

                    if (ratioOfHeight >= ratioOfWidth) {
                        current.options.imgForEdited.set({
                            scaleX: 1 / ratioOfWidth,
                            scaleY: 1 / ratioOfWidth
                        });
                    } else {
                        current.options.imgForEdited.set({
                            scaleX: 1 / ratioOfHeight,
                            scaleY: 1 / ratioOfHeight
                        });
                    }


                    if (current.options.imgForEdited.left < current.options.imgForEditedCanvas.width) {
                        current.options.imgForEdited.left = current.options.imgForEditedCanvas.width;
                    } else {
                        var diffLeft = current.options.imgForEdited.left - (current.options.imgForEdited.height * current.options.imgForEdited.scaleY);
                        if (diffLeft > 0) {
                            current.options.imgForEdited.left = current.options.imgForEdited.height * current.options.imgForEdited.scaleY;
                        }
                    }

                    if (current.options.imgForEdited.top > 0) {
                        current.options.imgForEdited.top = 0;
                    }

                    if (current.options.imgForEdited.top < 0) {
                        var objHeight = current.options.imgForEdited.width * current.options.imgForEdited.scaleX;
                        var topDiff = objHeight + current.options.imgForEdited.top;

                        if (topDiff < current.options.imgForEditedCanvas.height) {
                            current.options.imgForEdited.top = current.options.imgForEditedCanvas.height - objHeight;
                            current.options.imgForEditedCanvas.renderAll();
                        }
                    }
                } else if (current.options.imgForEdited.getAngle() == 180) {
                    var imgHeight = current.options.imgForEdited.height;
                    var imgWidth = current.options.imgForEdited.width;

                    var ratioOfHeight = imgHeight / current.options.imgForEditedCanvas.height;
                    var ratioOfWidth = imgWidth / current.options.imgForEditedCanvas.width;

                    if (ratioOfHeight >= ratioOfWidth) {
                        current.options.imgForEdited.set({
                            scaleX: 1 / ratioOfWidth,
                            scaleY: 1 / ratioOfWidth
                        });
                    } else {
                        current.options.imgForEdited.set({
                            scaleX: 1 / ratioOfHeight,
                            scaleY: 1 / ratioOfHeight
                        });
                    }

                    if (current.options.imgForEdited.left < current.options.imgForEditedCanvas.width) {
                        current.options.imgForEdited.left = current.options.imgForEditedCanvas.width;
                    } else {
                        var diffLeft = current.options.imgForEdited.left - (current.options.imgForEdited.width * current.options.imgForEdited.scaleX);
                        if (diffLeft > 0) {
                            current.options.imgForEdited.left = (current.options.imgForEdited.width * current.options.imgForEdited.scaleX);
                        }
                    }

                    if (current.options.imgForEdited.top < current.options.imgForEditedCanvas.height) {
                        current.options.imgForEdited.top = current.options.imgForEditedCanvas.height;
                    } else {
                        var diffTop = current.options.imgForEdited.top - (current.options.imgForEdited.height * current.options.imgForEdited.scaleY);
                        if (diffTop > 0) {
                            current.options.imgForEdited.top = current.options.imgForEdited.height * current.options.imgForEdited.scaleY;
                        }
                    }
                } else if (current.options.imgForEdited.getAngle() == 270) {
                    var imgHeight = current.options.imgForEdited.width;
                    var imgWidth = current.options.imgForEdited.height;

                    var ratioOfHeight = imgHeight / current.options.imgForEditedCanvas.height;
                    var ratioOfWidth = imgWidth / current.options.imgForEditedCanvas.width;

                    if (ratioOfHeight >= ratioOfWidth) {
                        current.options.imgForEdited.set({
                            scaleX: 1 / ratioOfWidth,
                            scaleY: 1 / ratioOfWidth
                        });
                    } else {
                        current.options.imgForEdited.set({
                            scaleX: 1 / ratioOfHeight,
                            scaleY: 1 / ratioOfHeight
                        });
                    }

                    if (current.options.imgForEdited.left > 0) {
                        current.options.imgForEdited.left = 0;
                    } else if ((current.options.imgForEdited.left + (current.options.imgForEdited.height * current.options.imgForEdited.scaleY)) < current.options.imgForEditedCanvas.width) {
                        current.options.imgForEdited.left = current.options.imgForEditedCanvas.width - (current.options.imgForEdited.height * current.options.imgForEdited.scaleY);
                    }

                    if (current.options.imgForEdited.top < current.options.imgForEditedCanvas.height) {
                        current.options.imgForEdited.top = current.options.imgForEditedCanvas.height;
                    } else {
                        var diffTop = current.options.imgForEdited.top - (current.options.imgForEdited.width * current.options.imgForEdited.scaleX);
                        if (diffTop > 0) {
                            current.options.imgForEdited.top = (current.options.imgForEdited.width * current.options.imgForEdited.scaleX);
                        }
                    }
                }
                current.options.imgForEditedCanvas.renderAll();
            }
        },
        editImageInPopup: function() {
            var current = this;
            current.options.imgForEdited = fabric.util.object.clone(current.options.currentObject);
            current.options.imgForEdited.set({
                lockMovementX: false,
                lockMovementY: false,
                lockScalingX: false,
                lockScalingY: false,
                lockRotation: false
            });
            current.options.imageEditPanelDialog.dialog('open');
            if (!current.options.imgForEditedCanvas) {
                current.options.imgForEditedCanvas = new fabric.Canvas("edit_img_canvas", {
                    selection: false,
                    backgroundColor: '#ffffff'
                });
                current.tempCanvasMoving();
            }

            $j(".image-edit-perview .canvas-container").show();
            if (current.options.imgForEdited) {
                current.options.currentCanvas.getObjects().forEach(function(o) {
                    if (o.id + '_image' === current.options.imgForEdited.id) {
                        current.options.boxWidth = o.width;
                        current.options.boxHeight = o.height;
                        current.options.editBoxLeft = o.left;
                        current.options.editBoxTop = o.top;
                    }
                });

                current.options.imgForEditedCanvas.clear();

                var totalPreviewWidth = $j('.image-edit-perview').width();
                var totalPreviewHeight = $j('.image-edit-perview').height();

                if (totalPreviewWidth && totalPreviewHeight) {

                    totalPreviewWidth = totalPreviewWidth * 0.9;
                    totalPreviewHeight = totalPreviewHeight * 0.9;
                    if (totalPreviewWidth > totalPreviewHeight) {

                        if (current.options.boxWidth > current.options.boxHeight) {
                            current.options.editImageScaleRatio = totalPreviewHeight / current.options.boxWidth;
                        } else {
                            current.options.editImageScaleRatio = totalPreviewHeight / current.options.boxHeight;
                        }
                    } else {
                        if (current.options.boxWidth > current.options.boxHeight) {
                            current.options.editImageScaleRatio = totalPreviewWidth / current.options.boxWidth;
                        } else {
                            current.options.editImageScaleRatio = totalPreviewWidth / current.options.boxHeight;
                        }
                    }
                }

                if ($j(window).width() > 1024 || $j(window).width() < 768) {
                    if (current.options.editImageScaleRatio < 1) {
                        current.options.editImageScaleRatio = 1
                    }
                }

                current.options.imgForEdited.left = (current.options.imgForEdited.left * current.options.editImageScaleRatio) - (current.options.editBoxLeft * current.options.editImageScaleRatio);
                current.options.imgForEdited.top = ((current.options.imgForEdited.top * current.options.editImageScaleRatio) - (current.options.editBoxTop * current.options.editImageScaleRatio));
                current.options.imgForEdited.scaleX = current.options.imgForEdited.scaleX * current.options.editImageScaleRatio;
                current.options.imgForEdited.scaleY = current.options.imgForEdited.scaleY * current.options.editImageScaleRatio;
                current.options.imgForEditedCanvas.setWidth(current.options.boxWidth * current.options.editImageScaleRatio);
                current.options.imgForEditedCanvas.setHeight(current.options.boxHeight * current.options.editImageScaleRatio);

                current.options.imgForEdited.set({
                    top: current.options.imgForEdited.top,
                    left: current.options.imgForEdited.left,
                    clipTo: null,
                    selectable: true,
                    hasRotatingPoint: false
                });
                current.options.imgForEditedCanvas.add(current.options.imgForEdited);
                current.options.imgForEditedCanvas.deactivateAllWithDispatch();
                $j(".rotation_slider").slider('value', current.options.imgForEdited.getAngle());
                current.options.imgForEditedCanvas.renderAll();

                $j(".image-edit-perview .canvas-container").position({
                    my: "center",
                    at: "center",
                    of: ".image-edit-perview"
                });

            }
        },
        tempCanvasMoving: function() {
            var current = this;
            if (current.options.imgForEditedCanvas) {
                current.options.imgForEditedCanvas.on("object:moving", function(e) {
                    if (e.target && e.target.type == 'image') {
                        if (e.target.angle == 90) {
                            if (e.target.left < (e.target.canvas.width)) {
                                e.target.left = (e.target.canvas.width);
                            } else {
                                var diffLeft = e.target.left - ((e.target.height * e.target.scaleY));
                                if (diffLeft > 0) {
                                    e.target.left = ((e.target.height * e.target.scaleY));
                                }
                            }

                            if (e.target.top > 0) {
                                e.target.top = 0;
                            }

                            if (e.target.top < 0) {
                                var objHeight = e.target.width * e.target.scaleX;
                                var topDiff = objHeight + e.target.top;

                                if (topDiff < e.target.canvas.height) {
                                    e.target.top = e.target.canvas.height - objHeight;
                                    e.target.canvas.renderAll();
                                }
                            }
                            e.target.canvas.renderAll();
                        } else if (e.target.angle == 180) {
                            if (e.target.left < (e.target.canvas.width)) {
                                e.target.left = (e.target.canvas.width);
                            } else {
                                var diffLeft = e.target.left - (e.target.width * e.target.scaleX);
                                if (diffLeft > 0) {
                                    e.target.left = (e.target.width * e.target.scaleX);
                                }
                            }

                            if (e.target.top < e.target.canvas.height) {
                                e.target.top = e.target.canvas.height;
                            } else {
                                var diffTop = e.target.top - (e.target.height * e.target.scaleY);
                                if (diffTop > 0) {
                                    e.target.top = e.target.height * e.target.scaleY;
                                }
                            }
                        } else if (e.target.angle == 270) {
                            if (e.target.left > 0) {
                                e.target.left = 0;
                            } else if ((e.target.left + (e.target.height * e.target.scaleY)) < e.target.canvas.width) {
                                e.target.left = (e.target.canvas.width - (e.target.height * e.target.scaleY));
                            }

                            if (e.target.top < e.target.canvas.height) {
                                e.target.top = e.target.canvas.height;
                            } else {
                                var diffTop = e.target.top - (e.target.width * e.target.scaleX);
                                if (diffTop > 0) {
                                    e.target.top = e.target.width * e.target.scaleX;
                                }
                            }
                        } else if (e.target.angle == 0) {
                            if (e.target.left > 0 || e.target.top > 0) {
                                if (e.target.left > 0) {
                                    e.target.set({
                                        left: 0
                                    });
                                }

                                if (e.target.top > 0) {
                                    e.target.set({
                                        top: 0
                                    });
                                }
                                e.target.canvas.renderAll();
                            }

                            if (e.target.left < 0) {
                                var objWidth = e.target.width * e.target.scaleX;
                                var leftDiff = objWidth + e.target.left;

                                if (leftDiff < e.target.canvas.width) {
                                    e.target.left = e.target.canvas.width - objWidth;
                                    e.target.canvas.renderAll();
                                }
                            }

                            if (e.target.top < 0) {
                                var objHeight = e.target.height * e.target.scaleY;
                                var topDiff = objHeight + e.target.top;

                                if (topDiff < e.target.canvas.height) {
                                    e.target.top = e.target.canvas.height - objHeight;
                                    e.target.canvas.renderAll();
                                }
                            }
                        }
                    }
                });
            }
        },
        changeMugColor: function(color) {
            var current = this;
            $j.each(current.options.mugcolor, function(index, colorArray) {
                if (index != 'cut_heart_black' && index != 'cut_heart_red') {
                    if (colorArray.title == color) {
                        current.options.defaultValues.palette_color.label = colorArray.title;
                        if (current.options.defaultValues.photomugType.value == "magic_photomug") {
                            current.options.defaultValues.palette_color.price = 0;
                        } else {
                            current.options.defaultValues.palette_color.price = colorArray.price;
                        }
                    }
                }
            });

            $j('.mug_color_link').removeClass('active');
            $j('.mug_color_link[name=' + current.options.defaultValues.palette_color.label + ']').addClass('active');
            current.selectDefaultValues();
            current.setPrice();
        },
        EnableDisableAddtoCart: function() {
            var current = this;

            var totalObjects = current.options.currentCanvas.getObjects();
            var boxCount = 0;
            var uploadedImageCounter = 0;

            $j.each(totalObjects, function(objectIndex, object) {
                if (object.type == 'rect') {
                    boxCount = boxCount + 1;
                } else if (object.type == 'image') {
                    uploadedImageCounter = uploadedImageCounter + 1;
                }
            });

            if (uploadedImageCounter >= boxCount) {
                $j('.add-to-cart-btn,.addtocart').removeClass('disabled');
            } else {
                $j('.add-to-cart-btn,.addtocart').addClass('disabled');
            }
        },
        zoomOutNew: function() {
            var current = this;
            if (current.options.imgForEdited && current.options.imgForEditedCanvas) {

                if (current.options.imgForEdited.getAngle() == 0) {
                    var scaleNewX = current.options.imgForEdited.scaleX / current.options.scale_factor;
                    var scaleNewY = current.options.imgForEdited.scaleY / current.options.scale_factor;

                    if ((current.options.imgForEdited.width * scaleNewX) >= current.options.imgForEditedCanvas.width && (current.options.imgForEdited.height * scaleNewY) >= current.options.imgForEditedCanvas.height) {
                        current.options.imgForEdited.set({
                            scaleX: current.options.imgForEdited.scaleX / current.options.scale_factor,
                            scaleY: current.options.imgForEdited.scaleY / current.options.scale_factor,
                        });

                        if (current.options.imgForEdited.top > 0) {
                            current.options.imgForEdited.top = 0;
                        }

                        if (current.options.imgForEdited.left > 0) {
                            current.options.imgForEdited.left = 0;
                        }

                        if (current.options.imgForEdited.left < 0) {
                            var objWidth = current.options.imgForEdited.width * current.options.imgForEdited.scaleX;
                            var leftDiff = objWidth + current.options.imgForEdited.left;

                            if (leftDiff < current.options.imgForEditedCanvas.width) {
                                current.options.imgForEdited.left = current.options.imgForEditedCanvas.width - objWidth;
                                current.options.imgForEditedCanvas.renderAll();
                            }
                        }

                        if (current.options.imgForEdited.top < 0) {
                            var objHeight = current.options.imgForEdited.height * current.options.imgForEdited.scaleY;
                            var topDiff = objHeight + current.options.imgForEdited.top;

                            if (topDiff < current.options.imgForEditedCanvas.height) {
                                current.options.imgForEdited.top = current.options.imgForEditedCanvas.height - objHeight;
                                current.options.imgForEditedCanvas.renderAll();
                            }
                        }

                        current.options.imgForEditedCanvas.renderAll();
                    }
                } else if (current.options.imgForEdited.getAngle() == 90) {
                    var scaleNewX = current.options.imgForEdited.scaleX / current.options.scale_factor;
                    var scaleNewY = current.options.imgForEdited.scaleY / current.options.scale_factor;

                    if ((current.options.imgForEdited.width * scaleNewX) >= current.options.imgForEditedCanvas.height && (current.options.imgForEdited.height * scaleNewY) >= current.options.imgForEditedCanvas.width) {
                        current.options.imgForEdited.set({
                            scaleX: current.options.imgForEdited.scaleX / current.options.scale_factor,
                            scaleY: current.options.imgForEdited.scaleY / current.options.scale_factor,
                        });


                        if (current.options.imgForEdited.left < current.options.imgForEditedCanvas.width) {
                            current.options.imgForEdited.left = current.options.imgForEditedCanvas.width;
                        } else {
                            var diffLeft = current.options.imgForEdited.left - (current.options.imgForEdited.height * current.options.imgForEdited.scaleY);
                            if (diffLeft > 0) {
                                current.options.imgForEdited.left = current.options.imgForEdited.height * current.options.imgForEdited.scaleY;
                            }
                        }

                        if (current.options.imgForEdited.top > 0) {
                            current.options.imgForEdited.top = 0;
                        }

                        if (current.options.imgForEdited.top < 0) {
                            var objHeight = current.options.imgForEdited.width * current.options.imgForEdited.scaleX;
                            var topDiff = objHeight + current.options.imgForEdited.top;

                            if (topDiff < current.options.imgForEditedCanvas.height) {
                                current.options.imgForEdited.top = current.options.imgForEditedCanvas.height - objHeight;
                                current.options.imgForEditedCanvas.renderAll();
                            }
                        }

                        current.options.imgForEditedCanvas.renderAll();
                    }
                } else if (current.options.imgForEdited.getAngle() == 180) {
                    var scaleNewX = current.options.imgForEdited.scaleX / current.options.scale_factor;
                    var scaleNewY = current.options.imgForEdited.scaleY / current.options.scale_factor;

                    if ((current.options.imgForEdited.width * scaleNewX) >= current.options.imgForEditedCanvas.width && (current.options.imgForEdited.height * scaleNewY) >= current.options.imgForEditedCanvas.height) {
                        current.options.imgForEdited.set({
                            scaleX: current.options.imgForEdited.scaleX / current.options.scale_factor,
                            scaleY: current.options.imgForEdited.scaleY / current.options.scale_factor,
                        });

                        if (current.options.imgForEdited.left < current.options.imgForEditedCanvas.width) {
                            current.options.imgForEdited.left = current.options.imgForEditedCanvas.width;
                        } else {
                            var diffLeft = current.options.imgForEdited.left - (current.options.imgForEdited.width * current.options.imgForEdited.scaleX);
                            if (diffLeft > 0) {
                                current.options.imgForEdited.left = current.options.imgForEdited.width * current.options.imgForEdited.scaleX;
                            }
                        }

                        if (current.options.imgForEdited.top < current.options.imgForEditedCanvas.height) {
                            current.options.imgForEdited.top = current.options.imgForEditedCanvas.height;
                        } else {
                            var diffTop = current.options.imgForEdited.top - (current.options.imgForEdited.height * current.options.imgForEdited.scaleY);
                            if (diffTop > 0) {
                                current.options.imgForEdited.top = current.options.imgForEdited.height * current.options.imgForEdited.scaleY;
                            }
                        }
                        current.options.imgForEditedCanvas.renderAll();
                    }
                } else if (current.options.imgForEdited.getAngle() == 270) {
                    var scaleNewX = current.options.imgForEdited.scaleX / current.options.scale_factor;
                    var scaleNewY = current.options.imgForEdited.scaleY / current.options.scale_factor;

                    if ((current.options.imgForEdited.width * scaleNewX) >= current.options.imgForEditedCanvas.height && (current.options.imgForEdited.height * scaleNewY) >= current.options.imgForEditedCanvas.width) {
                        current.options.imgForEdited.set({
                            scaleX: current.options.imgForEdited.scaleX / current.options.scale_factor,
                            scaleY: current.options.imgForEdited.scaleY / current.options.scale_factor,
                        });

                        if (current.options.imgForEdited.left > 0) {
                            current.options.imgForEdited.left = 0;
                        } else if ((current.options.imgForEdited.left + (current.options.imgForEdited.height * current.options.imgForEdited.scaleY)) < current.options.imgForEditedCanvas.width) {
                            current.options.imgForEdited.left = current.options.imgForEditedCanvas.width - (current.options.imgForEdited.height * current.options.imgForEdited.scaleY);
                        }

                        if (current.options.imgForEdited.top < current.options.imgForEditedCanvas.height) {
                            current.options.imgForEdited.top = current.options.imgForEditedCanvas.height;
                        } else {
                            var diffTop = current.options.imgForEdited.top - (current.options.imgForEdited.width * current.options.imgForEdited.scaleX);
                            if (diffTop > 0) {
                                current.options.imgForEdited.top = current.options.imgForEdited.width * current.options.imgForEdited.scaleX;
                            }
                        }
                        current.options.imgForEditedCanvas.renderAll();
                    }
                }
            }
        },
        zoomInNew: function() {
            var current = this;
            if (current.options.imgForEdited) {
                current.options.imgForEdited.set({
                    scaleX: current.options.imgForEdited.scaleX * current.options.scale_factor,
                    scaleY: current.options.imgForEdited.scaleY * current.options.scale_factor,
                });
                current.options.imgForEditedCanvas.renderAll();
            }
        },
        storeUsedImagesOnLoad: function() {
            var current = this;
            $j.each(current.options.createdCanvases, function(index, currentCanvas) {
                if (current.options.canvasDesignJson[index]) {
                    var canvasDesignJson = current.options.canvasDesignJson[index];
                    $j.each(canvasDesignJson.objects, function(index2, imageObject) {
                        if (imageObject.type == 'image' && imageObject.id == null) {
                            current.options.usedImages[currentCanvas.lowerCanvasEl.id] = [imageObject.original_image_url];
                        }
                    });
                }
            });
        },
        checkdeleteImageUsedInCanvas: function(showUsedImage) {
            var current = this;
            var imageUsedInOtherCanvas;
            if (Object.keys(current.options.usedImages).length <= 0 || showUsedImage == '') {
                return;
            }
            $j.each(current.options.usedImages, function(currentCanvasID, imageArray) {
                if ($j.inArray(showUsedImage, imageArray) === -1) {
                    imageUsedInOtherCanvas = false;
                } else {
                    imageUsedInOtherCanvas = true;
                    return false;
                }
            });

            var draggableDiv = $j('.owl-item');
            $j.each(draggableDiv, function(index, divObject) {
                if ($j(divObject).children().find('img').attr('src') == showUsedImage) {
                    imageUsedInOtherCanvas = true;
                }
            });

            if (imageUsedInOtherCanvas == false && $j('#id-name--1').is(':checked') == true) {
                current.hideShowUsedImages('', '', showUsedImage);
            }
        },
        hideShowUsedImages: function(status, clicked, showDeletedImage) {
            var current = this;
            var usedImagesArray = [];
            var usedImagesUniqueArray = [];
            var divPosition = [];
            if (Object.keys(current.options.usedImages).length <= 0) {
                return;
            }
            if (status == '' || status == undefined || status == null) {
                var status = $j('#id-name--1').is(':checked');
            }
            $j.each(current.options.usedImages, function(currentCanvasID, imageArray) {
                $j.each(imageArray, function(imageIndex, image) {
                    usedImagesArray.push(image);
                });
            });
            $j.each(usedImagesArray, function(index, image) {
                if ($j.inArray(image, usedImagesUniqueArray) === -1) usedImagesUniqueArray.push(image);
            });

            var draggableDiv = $j('.owl-item');
            $j.each(draggableDiv, function(index, divObject) {
                $j.each(usedImagesUniqueArray, function(usedImageIndex, imageSrc) {
                    if ($j(divObject).children().find('img').attr('src') == imageSrc) {
                        divPosition.push($j(divObject).index());
                    }
                });
            });
            divPosition.sort(function(a, b) {
                return b - a
            });

            if (status == true) {
                $j.each(divPosition, function(index, position) {
                    current.uploadedImageSlider('removeItem', '', position);
                });
            } else if (status == false && clicked == true) {
                $j.each(usedImagesUniqueArray, function(index, imageSrc) {
                    current.uploadedImageSlider('addItem', '<ul id="draggable"><li><a class="draggable-img" href="javascript:void(0);"><img class="draggable draggable-image" src=' + imageSrc + ' width="70"></a><a href="javascript:void(0);" class="delete" ><i class="fa fa-times" aria-hidden="true"></i></a></li></ul>');
                });
            }

            if (current.options.showUsedImage != '' && status == true) {
                current.uploadedImageSlider('addItem', '<ul id="draggable"><li><a class="draggable-img" href="javascript:void(0);"><img class="draggable draggable-image" src=' + current.options.showUsedImage + ' width="70"></a><a href="javascript:void(0);" class="delete" ><i class="fa fa-times" aria-hidden="true"></i></a></li></ul>');
                current.options.showUsedImage = '';
            } else {
                current.options.showUsedImage = '';
            }

            if (showDeletedImage != '' && showDeletedImage != undefined && showDeletedImage != null) {
                current.uploadedImageSlider('addItem', '<ul id="draggable"><li><a class="draggable-img" href="javascript:void(0);"><img class="draggable draggable-image" src=' + showDeletedImage + ' width="70"></a><a href="javascript:void(0);" class="delete" ><i class="fa fa-times" aria-hidden="true"></i></a></li></ul>');
                current.options.showUsedImage = '';
            }
            current.applyDraggable();
        },
        deleteImageFromUsedImageArray: function(imageSrc, canvasId, forcefullyDelete) {
            var current = this;
            var deletedImageSrc = imageSrc;
            var imageUsedInLayout = false;
            if (canvasId == '') {
                canvasId = current.options.currentCanvas.lowerCanvasEl.id;
            }

            if (forcefullyDelete == false) {
                /*If same image used on same canvas but in different layout box, it will not be remove from array*/
                $j.each(current.options.currentCanvas.getObjects(), function(objIndex, object) {
                    if (object.type == 'image' && object.getSrc() == imageSrc) {
                        imageUsedInLayout = true;
                    }
                });
            }
            if (imageUsedInLayout == false) {
                if (Object.keys(current.options.usedImages).length > 0) {
                    $j.each(current.options.usedImages[canvasId], function(index, value) {
                        if (value == deletedImageSrc) {
                            current.options.usedImages[canvasId].splice(index, 1);
                        } else {
                            // do something
                        }
                    });
                }
            }
            //current.hideShowUsedImages();
        },
        addImageInUsedImageArray: function(imageSrc) {
            var current = this;
            var canvasId = current.options.currentCanvas.lowerCanvasEl.id;
            if (Object.keys(current.options.usedImages).length > 0) {
                if (current.options.usedImages[canvasId] != undefined && current.options.usedImages[canvasId].length > 0) {
                    current.options.usedImages[canvasId].push(imageSrc);
                } else {
                    current.options.usedImages[canvasId] = [];
                    current.options.usedImages[canvasId].push(imageSrc);
                }
            } else {
                current.options.usedImages[canvasId] = [];
                current.options.usedImages[canvasId].push(imageSrc);
            }
        },
        deleteAllImagesFromUsedImage: function() {
            var current = this;
            var deletedImages = [];
            canvasId = current.options.currentCanvas.lowerCanvasEl.id;
            deletedImages = current.options.usedImages[canvasId];
            current.options.usedImages[canvasId] = [];
            if (deletedImages != undefined && deletedImages.length > 0) {
                $j.each(deletedImages, function(index, imageSrc) {
                    current.checkdeleteImageUsedInCanvas(imageSrc);
                });
            }
        },
        disableImageEditOptions: function() {
            var current = this;
            var rectCounter = 0;

            current.options.currentCanvas.getObjects().forEach(function(o) {
                if (o.type == 'rect') {
                    rectCounter = rectCounter + 1;
                }
            });
            if (rectCounter > 1) {
                $j("#swapImage > a").removeClass('disabled');
            } else {
                $j("#swapImage > a").addClass('disabled');
            }
        },
        updateEditedImage: function() {
            var current = this;
            if (current.options.imgForEdited && current.options.currentObject && current.options.currentObject.type == 'image') {
                current.options.imgForEdited.set({
                    lockMovementX: true,
                    lockMovementY: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockRotation: true
                });

                current.options.imgForEdited.left = current.options.imgForEdited.left / current.options.editImageScaleRatio;
                current.options.imgForEdited.top = current.options.imgForEdited.top / current.options.editImageScaleRatio;
                current.options.imgForEdited.scaleX = current.options.imgForEdited.scaleX / current.options.editImageScaleRatio;
                current.options.imgForEdited.scaleY = current.options.imgForEdited.scaleY / current.options.editImageScaleRatio;

                current.options.currentObject.scaleX = current.options.imgForEdited.scaleX;
                current.options.currentObject.scaleY = current.options.imgForEdited.scaleY;
                current.options.currentObject.setAngle(current.options.imgForEdited.getAngle());
                current.options.currentObject.setOpacity(current.options.imgForEdited.getOpacity());
                current.options.currentObject.setTop(current.options.imgForEdited.getTop() + current.options.editBoxTop);
                current.options.currentObject.setLeft(current.options.imgForEdited.getLeft() + current.options.editBoxLeft)
                current.options.currentObject.setCoords();
                current.options.currentCanvas.renderAll();
            }
            current.options.imageEditPanelDialog.dialog('close');
        },
        changeSummaryPanel: function() {
            var current = this;

            var currentTheme = '';

            if (current.options.defaultValues.photomugType.mug_size) {
                var newSizeText = current.options.defaultValues.photomugType.value;

                if (newSizeText == 'photomug_photomug') {
                    newSizeText = 'Standard Mug';
                } else if (newSizeText == 'tea_photomug') {
                    newSizeText = 'Tea Photo Mug';
                } else if (newSizeText == 'cut_heart_handle_magic_photomug') {
                    newSizeText = 'Cut Heart Handle Magic Mug';
                } else if (newSizeText == 'cut_heart_handle_white_photomug') {
                    newSizeText = 'Cut Heart Handle White Mug';
                } else if (newSizeText == 'heart_handle_red_magic_photomug') {
                    newSizeText = 'Heart Handle Red Magic Mug';
                } else if (newSizeText == 'heart_handle_white_photomug') {
                    newSizeText = 'Heart Handle White Mug';
                } else if (newSizeText == 'beer_photomug') {
                    newSizeText = 'Beer Mug';
                } else if (newSizeText == 'frosted_photomug') {
                    newSizeText = 'Frosted Mug';
                } else if (newSizeText == 'golden_photomug') {
                    newSizeText = 'Golden Mug';
                } else if (newSizeText == 'silver_photomug') {
                    newSizeText = 'Silver Mug';
                } else {
                    newSizeText = 'Magic Mug';
                }

                $j('.product_size').html(newSizeText);
            }
            if (current.options.defaultValues.palette_color) {
                $j('.mug_color').html(current.options.defaultValues.palette_color.label);
            }

            if (current.options.defaultValues) {

                $j.each(current.options.layoutCategories, function(index, category) {
                    if (category.id == current.options.defaultValues.layout.defaultLayoutCategory) {
                        var currentLayout = category.name;
                        $j('.layout_title').html(currentLayout);
                    }
                });

                $j.each(current.options.themeCategories, function(index, category) {
                    // if(category.id == current.options.defaultValues.theme.defaultThemeCategory && current.options.defaultValues.theme.defaultTheme.value != ''){
                    //         currentTheme = category.name;
                    //         $j('.theme_title').html(currentTheme);
                    // }
                });

                if (currentTheme == '') {
                    $j('.theme_title').html('None');
                }
            }
        },
        selectAccordian: function(accordionClass, accordionElemClass, id) {
            var current = this;
            $j.each($j(accordionElemClass), function(index, obj) {
                if ($j(obj).attr('id').toLowerCase() == id.toLowerCase()) {
                    $j(accordionClass).accordion("option", "active", index);
                }
            });
        },

        selectLayoutThemes: function() {
            var current = this;
            var currentPageLayoutId = current.options.defaultValues.layout.defaultLayout.value;
            $j('.layout_image').removeClass('active');
            $j('#layout_image_' + currentPageLayoutId).addClass('active');
            current.selectAccordian('.layouts_accordion', '.layout_categories', 'layout_category_' + current.options.defaultValues.layout.defaultLayoutCategory);
            current.changeSummaryPanel();
        },

        checkLayoutTypeChange: function(selectedLayoutObj) {
            var current = this;
            var reselectCat = true;
            $j("#remove_design_confirm").html('Once you change layout, all your design will be lost. Are you sure?');
            current.options.removeDesignDialogConfirm = $j("#remove_design_confirm").dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: [{
                        text: "Continue",
                        class: "btn confirm",
                        click: function() {
                            reselectCat = false;
                            $j(this).dialog("close");
                            current.applyLayout(selectedLayoutObj);
                        }
                    },
                    {
                        text: "Cancel",
                        class: "btn not_confirm",
                        click: function() {
                            reselectCat = true;
                            $j(this).dialog("close");
                            current.selectLayoutThemes();
                        }
                    }
                ],
                open: function(event, ui) {
                    current.options.currentPopup = this;
                },
                close: function(event, ui) {
                    if (reselectCat == true) {
                        current.selectLayoutThemes();
                    }
                }
            });
        },

        applyLayout: function(selectedLayout) {
            var current = this;
            var inputID = ($j(selectedLayout).attr('input_id'));

            if (current.options.defaultValues.layout.defaultLayout.value != $j(selectedLayout).children('img').attr('id')) {

                $j('.layout_image').removeClass('active');
                $j(selectedLayout).addClass('active');

                current.options.layout = $j('#' + inputID).val();
                current.options.layout = $j.parseJSON(current.options.layout);

                if (current.options.layout) {
                    current.deleteAllImagesFromUsedImage();
                    current.hideShowUsedImages();
                    var currentObject = current.options.currentCanvas.getObjects();
                    if (currentObject.length > 0) {
                        $j(currentObject).each(function(index, obj) {
                            if (obj.type != 'text' || obj.type != 'curvedText') {
                                current.options.currentCanvas.remove(obj);
                            }
                        });
                    }
                    current.options.currentCanvas.renderAll();
                    $j('.canvas-container .demo-image').remove();
                    for (var i in current.options.layout) {
                        current.addBoxIncanvas(current.options.currentCanvas, i);
                    }
                    /*Change default values*/
                    $j.each(current.options.layoutThemeOptions.layout_options, function(index, layout) {
                        var layoutId = $j(selectedLayout).attr('id').split('layout_image_');

                        if (layout.value == layoutId[1]) {
                            current.options.defaultValues.layout.defaultLayout.label = layout.label;
                            current.options.defaultValues.layout.defaultLayout.value = layout.value;
                            current.options.defaultValues.layout.defaultLayout.price = layout.price;
                            current.options.defaultValues.layout.defaultLayout.input_id = layout.input_id;
                            current.options.defaultValues.layout.defaultLayoutCategory = layout.category_id;
                            current.selectDefaultValues();
                            //current.setPrice();
                        }
                    });
                    current.setPrice(0, 0, current.options.defaultValues.size.value);
                }
            }
            current.disableImageEditOptions();
            current.EnableDisableAddtoCart();
        },
        loadSelectedEffect: function(selectedEffect) {
            var current = this;
            $j('#month-list').val(selectedEffect);
            $j('#month-list').selectmenu('refresh');
            $j('#mugEffect').val(selectedEffect);
        },
        selectDefaultValues: function() {
            var current = this;
            var defaultValues = current.options.defaultValues;
            $j('#month-list').empty();
            var effectOptionSelector = $j('#month-list');

            if (defaultValues.mugEffect) {
                $j('.select-month').show();
                var optionData = "";
                var mugSelectedEffect = {};
                $j(defaultValues.mugEffect).each(function(key, effectOption) {
                    var selectedString = "";
                    if (key == 0) {
                        mugSelectedEffect = effectOption;
                    } else if (effectOption.selected) {
                        mugSelectedEffect = effectOption;
                        selectedString = 'selected="selected"';
                    }
                    optionData = $j('<option ' + selectedString + ' value="' + effectOption.value + '"> ' + effectOption.label + ' </option>');
                    $j(optionData).appendTo(effectOptionSelector);
                });
                current.createAddToCartForm('mugEffect', 'mugEffect', mugSelectedEffect.value, true);
                $j('#mugEffect').val(mugSelectedEffect.value);
                try {
                    $j('#month-list').selectmenu('refresh');
                } catch (err) {

                }
            } else {
                current.removeAddToCartFormElement('mugEffect');
                $j('.select-month').hide();
            }

            if (defaultValues.photomugType) {
                current.options.defaultPhotomugType = defaultValues.photomugType.value;
                current.createAddToCartForm('photomug_type_label', 'photomug_type_label', defaultValues.photomugType.label, false);
                current.createAddToCartForm('photomug_type', 'photomug_type', defaultValues.photomugType.value, false);
                current.createAddToCartForm('product_price', 'product_price', defaultValues.photomugType.price, true);
                current.options.typeName = defaultValues.photomugType.value;
                $j('.product-name-selected').html(defaultValues.photomugType.text_label);
                $j('.selected_sizes').removeClass('active');
                $j('.' + defaultValues.photomugType.value).addClass('active');

                $j('.mug-bg-img').removeClass(current.options.mugBgClass);
                $j('.mug-screenshot').removeClass("screenshot_" + current.options.mugBgClass);

                if (current.options.defaultValues.palette_color.value == 'cut_heart_black') {
                    current.options.mugBgClass = 'cut_heart_handle_black_magic_photomug';
                } else if (current.options.defaultValues.palette_color.value == 'cut_heart_red') {
                    current.options.mugBgClass = 'cut_heart_handle_red_magic_photomug';
                } else {
                    current.options.mugBgClass = defaultValues.photomugType.value;
                }

                $j('.mug-bg-img').addClass(current.options.mugBgClass);
                $j('.mug-screenshot').addClass("screenshot_" + current.options.mugBgClass);
            }
            if (defaultValues.palette_color) {
                $j('.mug_color_link').removeClass('active');
                $j('.cut_heart_color').removeClass('active');
                $j('.' + defaultValues.palette_color.value).addClass('active');
                $j('.mug_color_link[name=' + defaultValues.palette_color.label + ']').addClass('active');
                var backgroundUrl = current.options.skinUrl + 'photomug/background-mug/' + defaultValues.size.label + '-' + current.options.defaultValues.palette_color.label + '.png';
                if (defaultValues.photomugType.value && defaultValues.photomugType.value != 'photomug_photomug' && defaultValues.photomugType.value != 'magic_photomug') {
                    backgroundUrl = current.options.skinUrl + 'photomug/background-mug/' + defaultValues.photomugType.value + '-' + defaultValues.size.label + '-' + current.options.defaultValues.palette_color.label + '.png';
                }
                $j('.mug-bg-img').attr('src', backgroundUrl);
                current.createAddToCartForm('palette_color_value', 'palette_color_value', defaultValues.palette_color.value, false);
                current.createAddToCartForm('palette_color_name', 'palette_color_name', defaultValues.palette_color.label, false);
                current.createAddToCartForm('palette_color_price', 'palette_color_price', defaultValues.palette_color.price, true);
            }
            if (defaultValues.size) {
                current.createAddToCartForm('size_label', 'size_label', defaultValues.size.label, false);
                current.createAddToCartForm('size', 'size', defaultValues.size.value, false);
                current.createAddToCartForm('mugliquidsize', 'mugliquidsize', defaultValues.photomugType.mug_size, false);
                current.createAddToCartForm('mugdimensions', 'mugdimensions', defaultValues.photomugType.mug_dimentions, false);
            }


            if (defaultValues) {
                if (defaultValues.layout) {
                    current.createAddToCartForm('layout_label_0', 'layout_label', defaultValues.layout.defaultLayout.label, false);
                    current.createAddToCartForm('layout_value_0', 'layout_value', defaultValues.layout.defaultLayout.value, false);
                    current.createAddToCartForm('layout_category_value_0', 'layout_category_value', defaultValues.layout.defaultLayoutCategory, false);
                    current.createAddToCartForm('input_id_0', 'input_id', defaultValues.layout.defaultLayout.input_id, false);
                    current.createAddToCartForm('layout_price_0', 'layout_price', defaultValues.layout.defaultLayout.price, true);
                } else {
                    current.removeAddToCartFormElement('layout_label_0');
                    current.removeAddToCartFormElement('layout_value_0');
                    current.removeAddToCartFormElement('layout_price_0');
                    current.removeAddToCartFormElement('input_id_0');
                }

                $j('.layout_image').removeClass('active');
                $j('#layout_image_' + defaultValues.layout.defaultLayout.value).addClass('active');

                if (defaultValues.defaultBackgroundColor || defaultValues.defaultBackgroundColor == '') {
                    current.createAddToCartForm('background_color_0', 'background_color[]', defaultValues.defaultBackgroundColor, false);
                } else {
                    current.removeAddToCartFormElement('background_color_0');
                }
            }
            current.changeSummaryPanel();
        },
        createAddToCartForm: function(optionId, optionName, optionValue, priceElement) {
            var current = this;
            var addToCartFormObj = $j('#add_to_cart_frm');
            if ($j('#' + optionId).length > 0) {
                $j('#' + optionId).val(optionValue);
            } else {
                var posterTypeInput = $j('<input/>');
                posterTypeInput.attr('id', optionId);
                posterTypeInput.attr('name', optionName);
                posterTypeInput.val(optionValue);
                posterTypeInput.appendTo(addToCartFormObj);
                if (priceElement == true) {
                    current.options.priceElementsArray.push(optionId);
                }
            }
        },
        removeAddToCartFormElement: function(elementId) {
            var current = this;
            var addToCartFormObj = $j('#add_to_cart_frm');
            $j('input').remove('#' + elementId);
            var remainingElementsArray = jQuery.grep(current.options.priceElementsArray, function(value) {
                return value != elementId;
            });
            current.options.priceElementsArray = remainingElementsArray;
        },
        loadEditCaseJson: function() {
            var current = this;
            current.showLoader();
            if (current.options.createdCanvases[0] && current.options.canvasDesignJson[0]) {
                if (typeof current.options.canvasDesignJson[0] == 'object' && current.options.canvasDesignJson[0].objects.length) {
                    $j.each(current.options.canvasDesignJson[0].objects, function(idx, obj) {
                        if (obj && (obj.type == 'i-text' || obj.type == 'text' || obj.type == 'curvedText')) {
                            current.loadSpecificFont(obj.fontFamily, current.options.createdCanvases[0]);
                        }
                    });
                }

                current.options.createdCanvases[0].loadFromJSON(JSON.stringify(current.options.canvasDesignJson[0]), function(o, object) {
                    if (object && (object.type == 'i-text' || object.type == 'text' || object.type == 'curvedText')) {
                        current.loadSpecificFont(object.fontFamily, current.options.createdCanvases[0]);
                    }

                    setTimeout(function() {
                        if (object && (object.type == 'i-text' || object.type == 'text' || object.type == 'curvedText')) {
                            current.loadSpecificFont(object.fontFamily, current.options.createdCanvases[0]);
                        }
                    }, 500);

                    current.options.createdCanvases[0].renderAll();
                    current.clipObjectEditCase();
                    current.renderTextInEdit();
                    current.hideLoader();
                    current.disableImageEditOptions();
                    current.EnableDisableAddtoCart();
                    current.setPrice(0, 0, current.options.defaultValues.size.value);
                    //current.loadRequiredFonts();
                });
            }
        },
        renderTextInEdit: function() {
            var current = this;
            jQuery.each(current.options.createdCanvases, function(index, currentCanvas) {
                var currentCanvasObjects = currentCanvas.getObjects();
                if (currentCanvasObjects != undefined && currentCanvasObjects != null && currentCanvasObjects.length > 0) {
                    currentCanvas.getObjects().forEach(function(o) {
                        if ((o.type === 'text' || o.type === 'curvedText') && o.text != '') {
                            var textFontFamily = o.fontFamily;
                            var fontObserv = new FontFaceObserver(textFontFamily);
                            fontObserv.load().then(function() {
                                o.setFontFamily(textFontFamily);
                                o.canvas.renderAll();
                                current.options.proofImages[index] = current.options.createdCanvases[index].toDataURL();
                            });
                        }
                    });
                }
            });
        },
        clipObjectEditCase: function() {
            var current = this;

            current.options.currentCanvas.getObjects().forEach(function(o) {
                if (o.type == 'rect') {
                    o.set({
                            selectable: false
                        }),
                        current.createDiv(current.options.currentCanvas, o.id, o)
                    current.clipImageObject(o, current.options.currentCanvas)
                    current.options.currentCanvas.renderAll();
                }
            });
        },
        clipImageObject: function(clipBox, canvasObject) {
            var current = this;

            var boxLeft = clipBox.left;
            var boxTop = clipBox.top;
            var boxWidth = clipBox.width;
            var boxHeight = clipBox.height;
            canvasObject.getObjects().forEach(function(obj) {
                if (clipBox.id + '_image' == obj.id) {
                    obj.set({
                        lockMovementX: true,
                        lockMovementY: true,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockRotation: true,
                        hasBorders: false,
                        hasControls: false
                    });
                    obj.clipTo = null;
                    obj.perPixelTargetFind = true;
                    obj.clipTo = function(ctx) {
                        ctx.save();
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                        ctx.rect(boxLeft + current.options.boxBorderColorWidth, boxTop + current.options.boxBorderColorWidth, boxWidth - current.options.boxBorderColorWidth, boxHeight - current.options.boxBorderColorWidth);
                        ctx.restore();
                    };
                }
            });
        },
        saveDesign: function() {
            var current = this;
            current.options.action = 'save_design';
            current.loginCheck();
        },
        saveDesignForm: function() {
            var current = this;
            if (current.options.designId != '' && current.options.designId > 0 && $j('#design_name').val() != '') {
                current.collectSVGProofImages();
            } else {
                current.options.loginDialog.dialog('close');
                current.options.registerDialog.dialog('close');
                current.options.saveDesignNameDialog.dialog('open');
            }
        },
        resetFormValidation: function() {
            var current = this;
            if (current.options.designerstudioLoginForm != null) {
                current.options.designerstudioLoginForm.validator.reset();
            }
            if (current.options.designerstudioRegisterForm != null) {
                current.options.designerstudioRegisterForm.validator.reset();
            }
            if (current.options.designerstudioForgetPaswordForm != null) {
                current.options.designerstudioForgetPaswordForm.validator.reset();
            }
        },
        loginCheck: function() {
            var current = this;
            current.showLoader();
            $j.ajax({
                type: "post",
                url: current.options.hostUrl + "general-tool-function/account/loginCheck",
                data: {},
                success: function(repliedResult) {
                    //var responseJSON = $j.parseJSON(repliedResult);
                    var responseJSON = repliedResult;
                    if (responseJSON.success == 0) {
                        current.options.loginDialog.dialog('open');
                    } else if (responseJSON.success == 1) {
                        $j('#user_id').val(responseJSON.user_id);
                        current.saveDesignForm();
                    }
                    current.hideLoader();
                }
            });
        },
        loginPost: function() {
            var current = this;
            var validateForm = current.options.loginFrm.validation('isValid');
            if (validateForm == true) {
                current.showLoader();
                var url = $j('#login_frm').attr('action');
                $j.ajax({
                    type: "post",
                    url: url,
                    data: $j('#login_frm').serialize(true),
                    success: function(response) {
                        //var responseText = $j.parseJSON(response);
                        var responseText = response;
                        if (responseText.error == 1) {
                            $j('.login-error-msg').show();
                            $j('.login-error-msg').html(responseText.message);
                        } else {
                            $j('#user_id').val(responseText.user_id);
                            current.saveDesignForm();
                        }
                        current.hideLoader();
                    }
                });
            }
        },
        registerPost: function() {
            var current = this;
            var key = $j('.g-key').val();
            var validateForm = current.options.registerFrm.validation('isValid');
            var verifyCallback = function(response) {
                current.hideLoader(4);
                $j('.captcha-response').val(response);
                grecaptcha.reset();
                current.registerPostData(response);
            };
            if (validateForm == false) {

            } else {
                try {
                    current.showLoader();
                    //grecaptcha.reset();
                    grecaptcha.render('recaptcha1', {
                        'sitekey': key,
                        'callback': verifyCallback,
                        'size': 'invisible',
                    });

                    grecaptcha.execute();
                } catch (error) {
                    /*possible duplicated instances*/
                    grecaptcha.reset();
                    grecaptcha.execute();
                }
            }
        },

        registerPostData: function(response) {
            var current = this;
            var validateForm = false;
            if (!response) {
                validateForm = false;
            } else {
                validateForm = true;
            }
            if (validateForm == true) {
                current.showLoader();
                var url = $j('#register_frm').attr('action');
                $j.ajax({
                    type: "post",
                    url: url,
                    dataType: "json",
                    data: $j('#register_frm').serialize(true),

                    success: function(response) {
                        // grecaptcha.reset();
                        // var responseText = $j.parseJSON(response);
                        var responseText = response;
                        if (responseText.error == 1) {
                            $j('.register-error-msg').show();
                            $j('.register-error-msg').html(responseText.message);
                        } else if (responseText.email_comfirmation == 1) {
                            $j('.register-success-msg').show();
                            $j('.register-success-msg').html(responseText.message);
                        } else if (responseText.error == 0) {
                            current.saveDesignForm();
                        }
                        current.hideLoader(4);
                    }
                });
            }
        },
        forgetPasswordPost: function() {
            var current = this;
            var validateForm = current.options.forgotPasswordFrm.validation('isValid');
            if (validateForm == true) {
                current.showLoader();
                var url = $j('#forgot_password_frm').attr('action');
                $j.ajax({
                    type: "post",
                    url: url,
                    data: $j('#forgot_password_frm').serialize(true),
                    success: function(response) {
                        //var responseText = $j.parseJSON(response);
                        var responseText = response;

                        if (responseText.error == 1) {
                            $j('.forgot-password-error-msg').show();
                            $j('.forgot-password-error-msg').html(responseText.message);
                        } else if (responseText.error == 0) {
                            $j('.forgot-password-error-msg').show();
                            $j('.forgot-password-error-msg').html(responseText.message);
                            $j('#forget_password_form_div').hide();
                        }
                        current.hideLoader();
                    }
                });
            }
        },
        addToCart: function() {
            var current = this;

            var allUsedImages = current.getAllUploadedImages();
            var totalPrice = current.calculateTotalPrice();
            var fotoliaImages = current.fotoliaImagesArray();
            var designtoolData = {};

            $j.each($j("#add_to_cart_frm").serializeArray(), function(key, value) {
                designtoolData[value['name']] = value['value'];
                designtoolData['type'] = current.options.defaultPhotomugType;
                designtoolData['fotolia_images'] = JSON.stringify(fotoliaImages);
                designtoolData['final_price'] = totalPrice;
                designtoolData['stock_image_count'] = current.options.totalStockImageCount;
                designtoolData['stock_image_price'] = current.options.totalStockImagePrice;
            });

            current.showLoader(true);
            var loaderText = 'Please Wait....<br />We are saving your design';
            $j('.loader_text').html(loaderText);
            $j.ajax({
                type: "post",
                url: current.options.hostUrl + "general-tool-function/index/saveDesign",
                data: {
                    name: $j('#design_name').val(),
                    json_data: JSON.stringify(current.options.canvasDesignJson),
                    proofImages: JSON.stringify(current.options.proofImages),
                    svgImages: JSON.stringify(current.options.svgImages),
                    is_template: 0,
                    status: 1,
                    type: current.options.type,
                    designtool_data: designtoolData,
                    user_id: current.options.userId,
                    designId: current.options.designId,
                    product_id: $j(".mug_sizes.active").attr('product_id'),
                    canvas_width_px: current.options.canvasWidth,
                    canvas_height_px: current.options.canvasHeight,
                    width: current.options.width,
                    height: current.options.height,
                    tool_type: current.options.toolType,
                    action: current.options.action,
                    unique_key: current.options.uniqueKey,
                },
                success: function(repliedResult) {
                    //var resultObject = $j.parseJSON(repliedResult);
                    var resultObject = repliedResult;
                    var totalPrice = current.calculateTotalPrice();
                    if (resultObject.status) {
                        if (resultObject.designId) {
                            current.options.designId = resultObject.designId;
                            current.options.itemId = resultObject.itemId;
                            //if(current.options.action == 'addtocart') {
                            if (current.options.itemId != '0' || current.options.action == 'addtocart') {
                                if (current.options.itemId != '0') {
                                    var loaderText = 'Please Wait....<br />We are updating your design into cart';
                                } else {
                                    var loaderText = 'Please Wait....<br />We are Adding your design into cart';
                                }
                                $j('.loader_text').html(loaderText);
                                /*Add product into cart*/
                                current.options.clickToCart = true;
                                var productId = $j(".mug_sizes.active").attr('product_id');
                                var fotoliaImages = current.fotoliaImagesArray();
                                var params = {
                                    'cart_id': current.options.cart_id,
                                    'product': productId,
                                    'design_id': current.options.designId,
                                    'item_id': current.options.itemId,
                                    'form_key': current.options.formKey,
                                    'size': current.options.height + 'x' + current.options.width,
                                    'type': current.options.defaultPhotomugType,
                                    'fotolia_images': JSON.stringify(fotoliaImages),
                                    'tool_type': current.options.toolType,
                                    final_price: totalPrice,
                                    designtool_data: designtoolData,
                                    'action': current.options.action,
                                    'stock_image_price': current.options.totalStockImagePrice,
                                    'stock_image_count': current.options.totalStockImageCount,
                                    'allUsedImages': JSON.stringify(allUsedImages)
                                }
                                $j.ajax({
                                    type: "post",
                                    url: current.options.hostUrl + "general-tool-function/index/addToCart/",
                                    data: params,
                                    success: function(result) {
                                        if (result.success != 0) {
                                            if (current.options.action == 'save_design') {
                                                var loaderText = 'Please Wait....<br />You are going to redirect to My Saved Design page.';
                                                var sessionParam = '';
                                                if (resultObject.sessionid) {
                                                    sessionParam = '?sessionid=' + resultObject.sessionid;
                                                }
                                                window.parent.location.href = current.options.mysavedDesignURL + sessionParam;
                                            } else {
                                                var loaderText = 'Please Wait....<br />You are going to redirect to Cart page.';
                                                window.parent.location.href = current.options.cartURL;
                                            }
                                            $j('.loader_text').html(loaderText);
                                        } else {
                                            alert(result.message);
                                            window.parent.location.href = result.redirct_url;
                                        }
                                        // current.hideLoader(6);
                                    }
                                });
                            } else if (current.options.action == 'save_design') {
                                // current.hideLoader(7);
                                // current.options.saveDesignSuccessDialog.dialog('open');
                                current.options.clickToSaveDesign = true;
                                var loaderText = 'Please Wait....<br />You are going to redirect to My Saved Design page.';
                                $j('.loader_text').html(loaderText);

                                var sessionParam = '';
                                if (resultObject.sessionid) {
                                    sessionParam = '?sessionid=' + resultObject.sessionid;
                                }
                                window.parent.location.href = current.options.mysavedDesignURL + sessionParam;
                            }
                        }
                    } else {
                        current.hideLoader(8);
                        alert(resultObject.msg);
                        current.options.errorInSave = true;
                        //window.location.reload();
                    }
                }
            });
        },
        getAllUploadedImages: function() {
            current = this;
            var usedImages = [];
            $j.each(current.options.createdCanvases, function(index, canvasObj) {
                $j.each(current.options.createdCanvases[index].getObjects(), function(objInx, obj) {
                    if (obj.type == 'image') {
                        usedImages.push(obj.original_image_url);
                    }
                });
                if (current.options.createdCanvases[index].backgroundImage != null) {
                    usedImages.push(current.options.createdCanvases[index].backgroundImage.original_image_url);
                }
            });
            return usedImages;
        },
        collectSVGProofImages: function() {
            var current = this;

            current.options.proofImages = [];
            current.options.svgImages = [];
            current.options.canvasDesignJson = [];
            current.options.currentCanvas.deactivateAllWithDispatch();
            current.options.currentCanvas.renderAll();


            html2canvas($j('.mug-screenshot'), {
                onrendered: function(canhtml) {
                    if (current.options.proofImages[0]) {
                        current.options.proofImages[0] = canhtml.toDataURL("image/jpg");
                    } else {
                        current.options.proofImages.push(canhtml.toDataURL("image/jpg"));
                    }

                    if (current.options.svgImages[0]) {
                        current.options.svgImages[0] = current.options.currentCanvas.toSVG();
                    } else {
                        current.options.svgImages.push(current.options.currentCanvas.toSVG());
                    }

                    if (current.options.canvasDesignJson[0]) {
                        current.options.canvasDesignJson[0] = current.options.currentCanvas.toJSON();
                    } else {
                        current.options.canvasDesignJson.push(current.options.currentCanvas.toJSON());
                    }
                    current.addToCart();
                }
            });
        },
        fotoliaImagesArray: function() {
            var current = this;
            var fotoliaImages = [];
            var fotoliaImageCounter = 0;
            var currentMonth = monthStart = current.options.startedMonth;
            var currentYear = current.options.startedYear;
            var maxMonths = current.options.maxCanvases;
            var year = parseInt($j('#monthpicker .ui-datepicker-year').val());
            var changedYear = 0;

            $j(current.options.createdCanvases).each(function(index) {
                var monthObject = current.options.createdCanvases[index].toJSON();
                var fotoliaId = '';
                $j.each(monthObject.objects, function(index2, object) {
                    if (object.type == 'image' && object.src != '') {
                        if (object.fotolia_id != undefined && object.fotolia_id != null && object.fotolia_id != '' && object.fotolia_id > 0) {
                            if (fotoliaId == '') {
                                fotoliaId = '' + object.fotolia_id;
                            } else {
                                fotoliaId = fotoliaId + ', ' + object.fotolia_id;
                            }
                            fotoliaImageCounter = fotoliaImageCounter + 1;
                        }
                    }
                });
                if (index == 0) {
                    fotoliaImages.push({
                        'month': 'cover',
                        'fotolia_image_id': fotoliaId
                    });
                } else {
                    var month = current.options.months[currentMonth - 1].substring(0, 3).toUpperCase() + '_' + currentYear;
                    fotoliaImages.push({
                        'month': month,
                        'fotolia_image_id': fotoliaId
                    });
                    if (currentMonth == maxMonths && changedYear == 0) {
                        currentMonth = 1;
                        maxMonths = monthStart - 1;
                        changedYear = $j.inArray(year, current.options.years) + 1;
                        currentYear = current.options.years[changedYear];
                    } else {
                        currentMonth++;
                    }
                }
                //fotoliaImages.push({photoCalendarObject.options.calendarGeneratedGroups[index].month});
            });
            if (fotoliaImageCounter == 0) {
                fotoliaImages = [];
            }
            return fotoliaImages;
        },
        showLoader: function(monthLoader, index) {
            var current = this;

            this.isLoading = true;
            if (monthLoader == true) {
                var loader = $j('#ajax-loading-mask');
            } else {
                var loader = $j('#ajax-loading-mask-regular');
            }
            if (loader) {
                loader.show();
                current.options.totalLoaderCalls = current.options.totalLoaderCalls + 1;
            }
        },
        hideLoader: function(monthLoader) {
            var current = this;
            this.isLoading = false;
            current.options.totalLoaderCalls = current.options.totalLoaderCalls - 1;
            if (current.options.totalLoaderCalls == 0) {
                var loader = $j('.ajax-loading-mask');
                if (loader) {
                    loader.hide();
                }
            } else if (current.options.totalLoaderCalls < 0) {
                current.options.totalLoaderCalls = 0;
            }
        },
        addScrollBar: function(scrollClass) {
            var current = this;
            $j("." + scrollClass).mCustomScrollbar({
                theme: "inset-2-dark",
                scrollInertia: 100,
                callbacks: {
                    onScrollStart: function() {
                        return false; /** do nothing when page start scroll **/
                    }
                }
            });
        },
        layoutPopup: function(popupId, autoOpen, destroy) {
            if (destroy == true || destroy == undefined) {
                $j('#' + popupId).popup('destroy');
            }
            $j('#' + popupId).popup({
                focusdelay: 400,
                outline: true,
                vertical: 'top',
                autoopen: autoOpen
            });
        },
        calculateTotalPrice: function() {
            var current = this;
            var totalPrice = 0.00;
            if (current.options.priceElementsArray.length > 0) {
                $j.each(current.options.priceElementsArray, function(index, id) {
                    if ($j('#' + id).length > 0 && $j('#' + id).val() > 0.00) {
                        totalPrice = parseFloat(totalPrice) + parseFloat($j('#' + id).val());
                    }
                })
            }
            current.options.totalStockImagePrice = current.calculateStockImagePrice();
            if (isNaN(current.options.totalStockImagePrice)) {
                current.options.totalStockImagePrice = 0.00;
            }
            totalPrice = parseFloat(totalPrice) + parseFloat(current.options.totalStockImagePrice);
            return totalPrice;
        },
        calculateStockImagePrice: function() {
            var current = this;
            var storeImages = current.fotoliaImagesArray();
            var storeImagesArray = [];
            $j.each(storeImages, function(key, value) {
                if (value.fotolia_image_id != '') {
                    var storeImageIds = value.fotolia_image_id.split(', ');
                    $j.each(storeImageIds, function(key1, stockId) {
                        if (storeImagesArray.length <= 0) {
                            storeImagesArray.push(stockId);
                        } else if ($j.inArray(stockId, storeImagesArray) < 0) {
                            storeImagesArray.push(stockId);
                        }
                    });
                }
            });
            current.options.totalStockImageCount = storeImagesArray.length;
            var totalStockImagePrice = storeImagesArray.length * parseFloat(current.options.stockImagePrice);
            return totalStockImagePrice;
        },
        setPrice: function(price, discount_price, size) {
            var current = this;
            var totalPrice = current.calculateTotalPrice();
            if (totalPrice >= 0) {
                current.options.currentPrice = parseFloat(price).toFixed(2);
                current.options.discountPrice = parseFloat(totalPrice).toFixed(2);
            }
            current.changePrice();
        },
        getPrice: function() {
            var current = this;
            return current.options.currentPrice;
        },
        getDiscountPrice: function() {
            var current = this;
            return current.options.discountPrice;
        },
        resetCanvas: function(element) {
            var current = this;

            if (!$j(element).hasClass('cut_heart_color')) {
                $j('.mug_sizes').removeClass('active');
                $j(element).addClass('active');
            }

            current.options.height = parseFloat($j(element).attr('productheight'));
            current.options.width = parseFloat($j(element).attr('productwidth'));
            $j('.add-to-cart-btn,.addtocart').addClass('disabled');
            current.changeCanvasSize();
            current.resetOptions(element);
        },
        resetOptions: function(element) {
            var current = this;
            var ajaxUrl = current.options.hostUrl + "photomug-tool/photomug/resetOptions";
            var pillowColor = current.options.defaultValues.palette_color.value;
            if ($j('.mug_sizes.active').attr('typelable') == 'magic_photomug') {
                pillowColor = 'Black';
            } else if ($j('.mug_sizes.active').attr('typelable') == 'heart_handle_red_magic_photomug') {
                pillowColor = 'Red';
            } else if ($j('.mug_sizes.active').attr('typelable') == 'frosted_photomug' ||
                $j('.mug_sizes.active').attr('typelable') == 'beer_photomug') {
                pillowColor = 'Transparent';
            } else if ($j('.mug_sizes.active').attr('typelable') == 'golden_photomug') {
                pillowColor = 'Golden';
            } else if ($j('.mug_sizes.active').attr('typelable') == 'silver_photomug') {
                pillowColor = 'Silver';
            } else if ($j('.mug_sizes.active').attr('typelable') == 'cut_heart_handle_magic_photomug') {
                if ($j(element).hasClass('cut_heart_color')) {
                    pillowColor = $j(element).attr('typelable');
                } else {
                    pillowColor = 'cut_heart_black';
                }
            } else {
                pillowColor = 'White';
            }

            var paramData = {
                height: current.options.height,
                width: current.options.width,
                product_id: $j(element).attr('product_id'),
                mug_type: $j('.mug_sizes.active').attr('type'),
                design_id: current.options.designId,
                palette_color_name: pillowColor
            };

            current.showLoader();
            $j.ajax({
                type: "post",
                url: ajaxUrl,
                data: paramData,
                error: function(xhr, ajaxOptions, thrownError) {
                    current.hideLoader();
                },
                success: function(jsonReply) {
                    if (!$j.isEmptyObject(jsonReply)) {
                        if (jsonReply.theme_html) {
                            $j('.themes_panel').remove();
                            $j('#left-menu').append(jsonReply.theme_html);
                        }
                        if (jsonReply.layout_html) {
                            $j('.layouts_panel').remove();
                            $j('#left-menu').append(jsonReply.layout_html);
                        }
                        if (jsonReply.palette_html) {
                            $j('#left-menu .photomug_palettes_option').html('');
                            $j('#left-menu .photomug_palettes_option').html(jsonReply.palette_html);
                        }

                        if (paramData.mug_type) {
                            current.options.type = paramData.mug_type;
                        }
                        current.options.defaultValues = jsonReply.default_options;
                        current.selectDefaultValues();
                        current.createPhotoMug();
                        current.bindJSEvents();
                        current.setPrice(0, 0, $j(element).attr('product_id'));
                        current.disableImageEditOptions();
                        current.hideLoader();
                    }
                }
            });
            current.applyLazyLoader(current.options.lazyLoaderContainer.upload);
        },
        bindJSEvents: function() {
            var current = this;
            current.addScrollBar('mCustomScrollbar');
            current.options.loginDialog = $j('#login_form').dialog({
                autoOpen: false,
                minHeight: 280,
                width: 350,
                draggable: false,
                modal: true,
                close: function(event, ui) {
                    current.options.loginFrm.validation('clearError');
                }
            });

            current.options.registerDialog = $j('#register_form').dialog({
                autoOpen: false,
                minHeight: 400,
                width: 350,
                draggable: false,
                modal: true,
                close: function(event, ui) {
                    current.options.registerFrm.validation('clearError');
                    $j('#password-strength-meter-label').html('No Password');
                    $j('#password-strength-meter-container').removeClass();
                    $j('#password-strength-meter-container').addClass('password-none');
                }
            });

            current.options.forgetPasswordDialog = $j('#forgot_password_form').dialog({
                autoOpen: false,
                minHeight: 230,
                width: 350,
                draggable: false,
                modal: true,
                close: function(event, ui) {
                    current.options.forgotPasswordFrm.validation('clearError');
                    $j('.forgot-password-error-msg').hide();
                    $j('.forgot-password-error-msg').html('');
                    $j('#forget_password_form_div').show();
                }
            });

            current.options.saveDesignNameDialog = $j('#save_design_name_form').dialog({
                autoOpen: false,
                minHeight: 110,
                width: 350,
                draggable: false,
                modal: true,
                close: function(event, ui) {
                    current.resetFormValidation();
                }
            });

            current.options.saveDesignSuccessDialog = $j('#save_design_success').dialog({
                autoOpen: false,
                minHeight: 100,
                width: 350,
                draggable: false,
                modal: true,
                close: function(event, ui) {
                    current.resetFormValidation();
                }
            });

            current.options.imageEditPanelDialog = $j('#image_edit_panel').dialog({
                width: 1100,
                height: 500,
                autoOpen: false,
                dialogClass: "no-close",
                modal: true,
                draggable: false,
                position: {
                    my: 'center',
                    at: 'center',
                    of: window,
                    collision: 'fit'
                },
                resizable: false,
            });

            $j('.layouts_accordion').accordion({
                autoOpen: false,
                heightStyle: "content",
                collapsible: true,
                autoHeight: false,
                animate: 500,
            });

            $j('.image_options_tabs').tabs();
            $j('.image-edit-tabbing li[aria-controls="effects"]').hide();

            $j(".do-nicescrol").niceScroll();
            current.colorPicker('#canvas-background-color-picker', 'canvasBackground');
            current.applyLazyLoader(current.options.lazyLoaderContainer.upload);

            // Initialization login form validation
            current.options.loginFrm = $j('#login_frm');
            current.options.loginFrm.mage('validation', {});

            // Initialization registration form validation
            current.options.registerFrm = $j('#register_frm');
            current.options.registerFrm.mage('validation', {});

            // Initialization forgot paddword form validation
            current.options.forgotPasswordFrm = $j('#forgot_password_frm');
            current.options.forgotPasswordFrm.mage('validation', {});

            // Initialization of password strength meter
            $j('.input-box.password').passwordStrengthIndicator({
                "formSelector": "form.register_frm"
            });
        },
        changePrice: function() {
            var current = this;
            var finalPrice = 0.00;
            var price = current.getPrice();
            var discountPrice = current.getDiscountPrice();
            if (discountPrice) {
                $j('.original-price').show();
                $j('.discounted-price').empty();
                $j('.discounted-price').html(current.options.currency + discountPrice);
                $j('.original-price').empty();
                var striker = $j('<strike>' + current.options.currency + price + '</strike>');
                striker.appendTo($j('.original-price'));
                $j('.cart-price').removeClass('fix-price');
                $j('#final-price').html(current.options.currency + discountPrice);
            } else {
                $j('.original-price').hide();
                $j('.discounted-price').empty();
                $j('.discounted-price').html(current.options.currency + price);
                $j('.cart-price').addClass('fix-price');
                $j('#final-price').html(current.options.currency + discountPrice);
            }
        },
        createCanvases: function() {
            var current = this;
            current.options.photoMugDiv = $j('#main_designtool_tool');
            $j(current.options.photoMugDiv).html('');
            current.options.createdCanvases = [];

            var canvasString = "";
            canvasString += '<canvas id="canvas_0" width="' + current.options.canvasWidth + '" height="' + current.options.canvasHeight + '" style="position: absolute; width: ' + current.options.canvasWidth + 'px; height: ' + current.options.canvasHeight + 'px; -moz-user-select: none;border: 1px dashed #cccccc"></canvas>';

            $j(current.options.photoMugDiv).append(canvasString);

            current.options.currentCanvas = new fabric.Canvas("canvas_0", {
                selection: false,
                backgroundColor: null,
                enableRetinaScaling: false,
            });

            current.createCanvasEvent(current.options.currentCanvas, 0);
            current.options.createdCanvases.push(current.options.currentCanvas);


            $j('.calendar-button-prev').hide();

            if (current.options.isEdit) {
                current.changeCanvasSize('initial');
            } else {
                current.changeCanvasSize();
                //current.loadRequiredFonts();
            }


            $j('.canvas-container').css({
                'margin': '0 auto',
            });
        },
        loadInitialLayout: function(canvasObject, layoutId) {
            var current = this;

            current.options.layout = $j('#' + layoutId).val();
            current.options.layout = $j.parseJSON(current.options.layout);
            var activeLayoutId = layoutId.replace('json', 'image');
            $j('#' + activeLayoutId).addClass('active');

            for (var i in current.options.layout) {
                current.addBoxIncanvas(canvasObject, i);
            }
        },
        createCanvasEvent: function(canvasObject, canvasIndex) {
            var current = this;

            canvasObject.on("mouse:down", function(e) {});

            canvasObject.on('touch:drag', function(e) {});

            canvasObject.on("text:changed", function(e) {});

            canvasObject.on("object:moving", function(e) {

                if (e.target && (e.target.type == 'text' || e.target.type == 'curvedText' || e.target.type == 'path-group')) {
                    var obj = e.target;
                    obj.setCoords();

                    if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
                        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
                        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
                    }

                    if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height ||
                        obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
                        obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
                        obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
                    }
                }

                if (e.target.type == 'text' || e.target.type == 'curvedText' || e.target.type == 'path-group') {

                    var textCanvasPosition = $j('.canvas-container:visible').position();
                    var deleteLeft = e.target.left + 30;
                    var deleteTop = e.target.top - 35;

                    if (deleteLeft < 1) {
                        deleteLeft = 20;
                    } else if (deleteTop < 1) {
                        deleteTop = -30;
                    }
                    $j('.edit-text').show();
                    $j('.edit-text').css('left', (deleteLeft) + (textCanvasPosition.left));
                    $j('.edit-text').css('top', (deleteTop) + textCanvasPosition.top);
                } else {
                    $j('.edit-text').hide();
                }
            });

            canvasObject.on("object:rotating", function(e) {
                if (current.options.currentObject.type == 'curvedText') {
                    let angle = current.options.currentObject.getAngle();
                    $j('#angle_text').val(parseInt(angle));
                }
            });

            canvasObject.on("object:scaling", function(e) {});

            canvasObject.on("mouse:over", function(e) {});

            canvasObject.on("mouse:out", function(e) {});

            canvasObject.on('selection:cleared', function(e) {
                current.selectionCleared();
            });

            canvasObject.on('object:modified', function(e) {});

            canvasObject.on('object:modified', function(e) {});

            canvasObject.on("object:selected", function(e) {
                current.objectSelected(e.target);
            });
        },
        changeCanvasSize: function() {
            var current = this;
            if (current.options.windowWidth < 360) {
                if (current.options.width == '7.5' && current.options.height == '5') {
                    current.options.canvasMaxHeight = parseFloat(130);
                    current.options.canvasMaxWidth = parseFloat(220);
                } else {
                    current.options.canvasMaxHeight = parseFloat(current.options.defaultValues.canvasmaxsize.height / 2.3);
                    current.options.canvasMaxWidth = parseFloat(current.options.defaultValues.canvasmaxsize.width / 2.3);
                }
            } else if (current.options.windowWidth >= 360 && current.options.windowWidth < 768) {
                if (current.options.width == '7.5' && current.options.height == '5') {
                    current.options.canvasMaxHeight = parseFloat(130);
                    current.options.canvasMaxWidth = parseFloat(220);
                } else {
                    current.options.canvasMaxHeight = parseFloat(current.options.defaultValues.canvasmaxsize.height / 2);
                    current.options.canvasMaxWidth = parseFloat(current.options.defaultValues.canvasmaxsize.width / 2);
                }
            } else {
                if (current.options.width < current.options.height) {
                    current.options.canvasMaxHeight = parseFloat(250);
                    current.options.canvasMaxWidth = parseFloat(500);
                } else if (current.options.width == '7.5' && current.options.height == '5') {
                    current.options.canvasMaxHeight = parseFloat(270);
                    current.options.canvasMaxWidth = parseFloat(500);
                } else {
                    current.options.canvasMaxHeight = parseFloat(current.options.defaultValues.canvasmaxsize.height);
                    current.options.canvasMaxWidth = parseFloat(current.options.defaultValues.canvasmaxsize.width);
                }
            }

            local1 = current.options.width * 72;
            local2 = current.options.height * 72;

            local3 = (current.options.canvasMaxWidth * 0.95) / local1;
            local4 = (current.options.canvasMaxHeight * 0.95) / local2;

            if (local3 < local4)
                local5 = local3;
            else
                local5 = local4;

            current.options.canvasWidth = local1 * local5;
            current.options.canvasHeight = local2 * local5;

            current.options.currentCanvas.setWidth(current.options.canvasWidth);
            current.options.currentCanvas.setHeight(current.options.canvasHeight);
            current.options.currentCanvas.renderAll();
        },
        setThemeLayout: function(flag) {
            var current = this;

            $j('.demo-image').remove();

            current.options.currentCanvas.clear();
            current.options.currentCanvas.backgroundColor = null;

            if (current.options.defaultValues.layout.defaultLayout.input_id) {
                current.loadInitialLayout(current.options.currentCanvas, current.options.defaultValues.layout.defaultLayout.input_id);
            }

            /*if(current.options.defaultValues.theme.defaultTheme.value ) {
            //current.applyTheme($j('.theme_'+current.options.defaultValues.theme.defaultTheme.value));
            }*/
        },
        setColor: function(container, color) {
            $j(container).spectrum("set", color);
        },
        applyDraggable: function() {
            var current = this;
            $uploadedImages = $j(".browse-images-list");
            $j("#draggable li", $uploadedImages).draggable({
                appendTo: 'body',
                helper: 'clone',
                containment: ".modal-overlay",
                stack: "#draggable",
                zIndex: 99999,
                cursor: 'move',
                start: function() {
                    $j(".image-added").show();
                },
                stop: function(event, ui) {
                    $j(".image-added").hide();
                    //$j( ".domo-image" ).hide();
                }

            });
        },
        applyLazyLoader: function(container) {
            //--- Lazy loader start
            var $container = $j(container);
            $container.find("img").lazyload({
                container: $container,
                threshold: 300,
                callback_load: function(element) {},
            });
            //--- Lazy loader end
        },
        openFotoliaPopup: function() {
            var current = this;
            var fotoliaContent = $j("#fotolia_dialog .fotolia-content").html().trim();
            if (fotoliaContent.length > 0) {
                current.layoutPopup('fotolia_dialog', true, false);
            } else {
                var ajaxUrl = current.options.hostUrl + "general-tool-function/index/fotoliaPopup";
                //var paramData = { 'selectedProduct' : current.options.type };
                var paramData = {};
                current.showLoader();
                $j.ajax({
                    type: "post",
                    url: ajaxUrl,
                    data: paramData,
                    error: function(xhr, ajaxOptions, thrownError) {
                        current.hideLoader();
                    },
                    success: function(jsonReply) {
                        if (!$j.isEmptyObject(jsonReply)) {
                            if (jsonReply.content) {
                                $j(jsonReply.content).each(function(index, value) {
                                    var content = value.content;
                                    if (content) {
                                        $j('#fotolia_dialog .fotolia-content').html(content);
                                        current.layoutPopup('fotolia_dialog', true, false);
                                    }
                                });
                            }
                            current.addScrollBar('light');
                            current.hideLoader();
                            //current.setOptionData(current.option, current.general);
                        }
                    }
                });
            }
        },
        createPhotoMug: function(flag) {
            var current = this;
            current.showLoader();
            current.setThemeLayout(flag);
            current.hideLoader();
        },
        dragUploadImage: function(el) {
            var current = this;
            current.options.draggedImgSrc = el.src;
        },
        addImageInCanvas: function() {
            var current = this;

            if (current.options.draggedImgSrc && current.options.draggedImgSrc != null) {
                fabric.Image.fromURL(current.options.draggedImgSrc, function(img) {
                    current.options.currentCanvas.add(img);




                    var imgScalX = current.options.canvasHeight / img.height;
                    var imgScalY = current.options.canvasHeight / img.height;
                    img.set({
                        left: fabric.util.getRandomInt(0, 100),
                        top: 0,
                        scaleX: imgScalX,
                        scaleY: imgScalY,
                    });
                    img.setCoords();
                    img = null;
                    current.options.draggedImgSrc = null;
                    current.options.currentCanvas.renderAll();
                });
            }
        },
        selectionCleared: function() {
            var current = this;
            $j('#text2').val('');
            $j('#arcText, #reverseText').prop('checked', false);
            $j('#arcOptions').hide();
            $j('#angle_text').val();
            current.options.isSwap = 0;
            current.options.currentObject = null;
            current.options.currentText = null;
            $j('.img-edit-panel').hide();
            $j('.edit-text').hide();
            current.setAlignmentDiableEnable();
        },
        objectSelected: function(currentObject) {
            var current = this;

            if (currentObject && currentObject.type == 'text' || currentObject.type == 'curvedText' || currentObject.type == 'path-group') {

                var textCanvasPosition = $j('.canvas-container:visible').position();
                var deleteLeft = currentObject.left + 30;
                var deleteTop = currentObject.top - 35;

                if (deleteLeft < 1) {
                    deleteLeft = 20;
                } else if (deleteTop < 1) {
                    deleteTop = -30;
                }
                $j('.edit-text').show();
                $j('.edit-text').css('left', (deleteLeft) + (textCanvasPosition.left));
                $j('.edit-text').css('top', (deleteTop) + textCanvasPosition.top);
            } else {
                $j('.edit-text').hide();
            }

            if (currentObject.type == 'rect') {
                current.options.boxLeft = currentObject.left;
                current.options.boxTop = currentObject.top;
                current.options.boxWidth = currentObject.width;
                current.options.boxHeight = currentObject.height;
                currentObject.setControlVisible('mt', false);
                currentObject.setControlVisible('mb', false);
                currentObject.setControlVisible('ml', false);
                currentObject.setControlVisible('mr', false);
                currentObject.setControlVisible('ml', false);
                currentObject.setControlVisible('mr', false);
                currentObject.setControlVisible('tr', false);
                currentObject.setControlVisible('tl', false);
                currentObject.setControlVisible('br', false);
                currentObject.setControlVisible('bl', false);
            }

            var firstBoxTop = 0,
                firstBoxLeft = 0,
                firstBoxWidth = 0,
                firstBoxHeight = 0,
                firstBoxId = 0,
                secondBoxTop = 0,
                secondBoxLeft = 0,
                secondBoxWidth = 0,
                secondBoxHeight = 0,
                secondBoxId = 0;

            if (current.options.isSwap == 1 && current.options.currentObject && current.options.currentObject != null && (current.options.currentObject.type == 'image')) {
                current.options.firstSwapObject = current.options.currentObject;

                current.options.currentCanvas.getObjects().forEach(function(o) {
                    if (o.id + '_image' == current.options.firstSwapObject.id) {
                        firstBoxTop = o.top;
                        firstBoxLeft = o.left;
                        firstBoxWidth = o.width;
                        firstBoxHeight = o.height;
                        firstBoxId = o.id;
                    }
                });
            }

            current.options.currentObject = currentObject;
            current.options.currentObject.setControlVisible('mt', false);
            current.options.currentObject.setControlVisible('mb', false);
            current.options.currentObject.setControlVisible('ml', false);
            current.options.currentObject.setControlVisible('mr', false);

            if (current.options.currentObject && current.options.currentObject.type == 'image') {
                $j('#text2').val('');
                current.options.currentText = null;
            } else if (current.options.currentObject && (current.options.currentObject.type == 'path-group' || current.options.currentObject.type == 'path')) {
                $j('#text2').val('');
                current.options.isSwap = 0;
                current.options.currentText = null;
                if (current.options.currentStep != 'clipart') {
                    current.openTab('clipart');
                }
            }
            if (current.options.currentObject.type == 'curvedText') {
                $j('#arcText').prop('checked', true);
                $j('#arcOptions').show();
                $j('#angle_text').val(parseInt(current.options.currentObject.angle));
                $j('#radius').val(parseInt(current.options.currentObject.radius));
                $j('#spacing').val(parseInt(current.options.currentObject.spacing));
                $j('#reverseText').prop('checked', current.options.currentObject.reverse);
            } else {
                $j('#arcText, #reverseText').prop('checked', false);
                $j('#radius').val(parseInt(current.options.defaultArcTextRadius));
                $j('#spacing').val(parseInt(current.options.defaultArcTextSpacing));
                $j('#arcOptions').hide();
                $j('#angle_text').val();
            }
            current.setAlignmentDiableEnable();
            if (current.options.currentObject && (current.options.currentObject.type == 'text' || current.options.currentObject.type == 'curvedText')) {
                current.options.isSwap = 0;
                $j("#text2").val(current.options.currentObject.text);
                current.options.currentText = current.options.currentObject;
                if (current.options.currentStep != 'addtext') {
                    current.openTab('addtext');
                }
                current.setColor('#text-color', current.options.currentObject.fill);

                $j("#textFontSize").val(current.options.currentObject.fontSize);
                var selectFontFamilly = current.options.currentObject.fontFamily;
                selectFontFamilly = selectFontFamilly.replace('_bi', '');
                selectFontFamilly = selectFontFamilly.replace('_b', '');
                selectFontFamilly = selectFontFamilly.replace('_i', '');
                $j("#textFontFamily").val(selectFontFamilly);

                $j('#textFontSize,#textFontFamily').selectmenu('refresh');

                $j('.text-align a').removeClass('active');
                $j('.font-style a').removeClass('active');

                if (current.options.currentObject.fontStyle == 'italic') {
                    $j("#textItalic").closest('a').addClass('active');
                    $j("#textItalic").closest('a').removeClass('disabled');
                }
                if (current.options.currentObject.fontWeight == 'bold') {
                    $j("#textBold").closest('a').addClass('active');
                    $j("#textBold").closest('a').removeClass('disabled');
                }
                if (current.options.currentObject.textDecoration == 'line-through') {
                    $j("#textOveline").closest('a').addClass('active');
                }
                if (current.options.currentObject.textDecoration == 'underline') {
                    $j("#textUnderline").closest('a').addClass('active');
                }
                $j('.text-align a[alignment = ' + current.options.currentObject.textAlign + ']').addClass('active');

                // Check bold or italic font style is available or not.
                if (current.options.fontDetails[selectFontFamilly]['b'] == null) {
                    $j("#textBold").closest('a').addClass('disabled');
                } else {
                    $j("#textBold").closest('a').removeClass('disabled');
                }
                if (current.options.fontDetails[selectFontFamilly]['i'] == null) {
                    $j("#textItalic").closest('a').addClass('disabled');
                } else {
                    $j("#textItalic").closest('a').removeClass('disabled');
                }
            }

            if (current.options.isSwap == 1 && current.options.currentObject && current.options.currentObject.type == 'image') {

                if (current.options.firstSwapObject.id == current.options.currentObject.id) {
                    return;
                }
                current.options.secondSwapObject = current.options.currentObject;

                current.options.currentCanvas.getObjects().forEach(function(o) {
                    if (o.id + '_image' === current.options.secondSwapObject.id) {
                        secondBoxTop = o.top;
                        secondBoxLeft = o.left;
                        secondBoxWidth = o.width;
                        secondBoxHeight = o.height;
                        secondBoxId = o.id;
                    }
                });

                var ratioOfHeight = current.options.secondSwapObject.height / firstBoxHeight;
                var ratioOfWidth = current.options.secondSwapObject.width / firstBoxWidth;

                if (ratioOfHeight >= ratioOfWidth) {
                    current.options.secondSwapObject.set({
                        angle: 0,
                        scaleX: 1 / ratioOfWidth,
                        scaleY: 1 / ratioOfWidth,
                        id: firstBoxId + '_image',
                        left: firstBoxLeft,
                        top: firstBoxTop
                    });
                } else {
                    current.options.secondSwapObject.set({
                        angle: 0,
                        scaleX: 1 / ratioOfHeight,
                        scaleY: 1 / ratioOfHeight,
                        id: firstBoxId + '_image',
                        left: firstBoxLeft,
                        top: firstBoxTop
                    });
                }

                current.options.secondSwapObject.clipTo = function(ctx) {
                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.rect(firstBoxLeft + current.options.boxBorderColorWidth, firstBoxTop + current.options.boxBorderColorWidth, firstBoxWidth - current.options.boxBorderColorWidth, firstBoxHeight - current.options.boxBorderColorWidth);
                    ctx.restore();
                };
                current.options.secondSwapObject.setCoords();

                var ratioOfHeight = current.options.firstSwapObject.height / secondBoxHeight;
                var ratioOfWidth = current.options.firstSwapObject.width / secondBoxWidth;

                if (ratioOfHeight >= ratioOfWidth) {
                    current.options.firstSwapObject.set({
                        angle: 0,
                        scaleX: 1 / ratioOfWidth,
                        scaleY: 1 / ratioOfWidth,
                        id: secondBoxId + '_image',
                        left: secondBoxLeft,
                        top: secondBoxTop
                    });
                } else {
                    current.options.firstSwapObject.set({
                        angle: 0,
                        scaleX: 1 / ratioOfHeight,
                        scaleY: 1 / ratioOfHeight,
                        id: secondBoxId + '_image',
                        left: secondBoxLeft,
                        top: secondBoxTop
                    });
                }

                current.options.firstSwapObject.clipTo = function(ctx) {
                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.rect(secondBoxLeft + current.options.boxBorderColorWidth, secondBoxTop + current.options.boxBorderColorWidth, secondBoxWidth - current.options.boxBorderColorWidth, secondBoxHeight - current.options.boxBorderColorWidth);
                    ctx.restore();
                };
                current.options.currentObject = current.options.firstSwapObject;
                current.options.firstSwapObject.setCoords();
                current.options.currentCanvas.setActiveObject(current.options.currentObject);
                current.options.isSwap = 0;
                current.options.currentCanvas.renderAll();
            }

            if (current.options.currentObject && current.options.currentObject.type == 'image') {
                $j('.img-edit-panel').show();
                var boxtop = 0,
                    boxleft = 0;
                current.options.currentCanvas.getObjects().forEach(function(o) {
                    if (o.id + '_image' === current.options.currentObject.id) {
                        boxleft = o.left;
                        boxtop = o.top;
                    }
                });
                $j('.img-edit-panel').css('top', boxtop - 40);
                if (boxleft < 25) {
                    var leftpercent = parseInt(0) + boxleft / 5;
                } else {
                    var leftpercent = parseInt(5) + boxleft / 6;
                }

                leftpercent = parseInt(leftpercent)
                $j('.img-edit-panel').css('left', leftpercent + '%');

            } else {
                $j('.img-edit-panel').hide();
            }
        },
        fotoliaCategoryClickEvent: function(el) {
            var current = this;
            var srcImage = $j(el).attr('thumbnail-source');
            var filename = srcImage.substring(srcImage.lastIndexOf('/') + 1);
            filename = filename.split('.');
            var timestamp = new Date().getTime();
            fotoliaImage = 'adobestock_' + '_' + timestamp + '_' + filename[0] + '-_-_-' + $j(el).attr('fotolia-number') + '_test.' + filename[1];
            $j('.popup_wrapper').css('display', 'none');
            current.showLoader();

            $j.ajax({
                url: current.options.hostUrl + "general-tool-function/index/uploadportfolioimage",
                type: "POST",
                data: {
                    image: srcImage,
                    newFotoliaimage: fotoliaImage
                },
                success: function(data) {
                    //var response = JSON.parse(data);
                    var response = data;
                    if (response.status) {
                        current.uploadedImageSlider('addItem', '<ul id="draggable"><li><a class="draggable-img" href="javascript:void(0);"><img class="draggable" src=' + response.imagePath + ' width="70"></a><a href="javascript:void(0);" class="delete" ><i class="fa fa-times" aria-hidden="true"></i></a></li></ul>');

                        $j('#fotolia_dialog').popup('hide');
                        $j('.popup_background').css('opacity', 0);
                        $j('.popup_background').css('visibility', 'hidden');
                        current.applyDraggable();
                        current.hideLoader();
                        current.applyLazyLoader(current.options.lazyLoaderContainer.upload);
                    }
                }
            });
        },
        uploadSocialImage: function(pic) {
            var srcImage = pic;
            var current = this;
            srcImage = srcImage.replace("?", "!@!");
            srcImage = srcImage.replace(/&/g, "!^!");
            $j('.popup_wrapper').hide();
            $j('#ajax-loading-mask-regular').show();

            $j.ajax({
                url: current.options.uploadSocialImageURL,
                type: "POST",
                data: {
                    image: srcImage
                },
                success: function(data) {
                    //var response = JSON.parse(data);
                    var response = data;
                    if (response.status) {
                        current.uploadedImageSlider('addItem', '<ul id="draggable"><li><a class="draggable-img" href="javascript:void(0);"><img class="draggable" src=' + response.imagePath + ' width="70"></a><a href="javascript:void(0);" class="delete" ><i class="fa fa-times" aria-hidden="true"></i></a></li></ul>');

                        current.applyDraggable();
                        $j('#ajax-loading-mask-regular').hide();
                        current.applyLazyLoader(current.options.lazyLoaderContainer.upload);
                    }

                }
            });
        },
        applySlider: function() {
            var current = this;
            $j(".rotation_slider").slider({
                value: 0,
                min: 0,
                max: 360,
                step: 1,
                slide: function(event, ui) {
                    if (current.options.imgForEdited)
                        current.options.imgForEdited.setAngle(ui.value);

                    if (current.options.imgForEditedCanvas)
                        current.options.imgForEditedCanvas.renderAll();
                }
            });
        },
        deleteObject: function() {
            var current = this;
            var currentObject = '';
            if (current.options.currentObject && current.options.currentObject != null) {

                if (current.options.currentObject.type == 'image' && $j('#id-name--1').is(':checked') == true) {
                    current.hideShowUsedImages('', '', current.options.currentObject.getSrc());
                    currentObject = current.options.currentObject;
                }
                current.setAlignmentDiableEnable();
                // Remove image from used image array after deleting image
                if (current.options.currentObject.type == 'image') {
                    current.deleteImageFromUsedImageArray(current.options.currentObject.getSrc(), '');
                }
                if (current.options.currentObject.id && current.options.currentObject.type == 'image') {
                    var deleteImageBoxId = (current.options.currentObject.id).split("_image")[0];
                    $j('.' + (current.options.currentCanvas.lowerCanvasEl.id) + '_layout_' + deleteImageBoxId).show();
                    $j('.' + (current.options.currentCanvas.lowerCanvasEl.id) + '_layout_' + deleteImageBoxId).removeClass('image-added');
                    $j('.' + (current.options.currentCanvas.lowerCanvasEl.id) + '_logo_' + deleteImageBoxId).show();

                }


                current.options.currentCanvas.remove(current.options.currentObject);
                current.options.currentCanvas.renderAll();
                current.options.isSwap = 0;
                $j("#text2").val('');

                $j('.img-edit-panel').hide();
                if (currentObject != '' && currentObject.type == 'image' && $j('#id-name--1').is(':checked') == true) {
                    current.deleteImageFromUsedImageArray(currentObject.getSrc(), '', false);
                    current.checkdeleteImageUsedInCanvas(currentObject.getSrc());
                }
                current.EnableDisableAddtoCart();
                current.setPrice(0, 0, current.options.defaultValues.size.value);
            }
        },
        deleteImage: function(deleteObject, image) {
            var current = this;
            $j("#delete_image_confirm").dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: [{
                        text: "Yes",
                        class: "btn confirm",
                        click: function() {
                            var currentObj = current;
                            $j(this).dialog("close");
                            var position = $j(deleteObject).parent().parent().parent().index();
                            currentObj.showLoader();
                            $j.ajax({
                                type: "post",
                                url: currentObj.options.hostUrl + "general-tool-function/index/deleteImage",
                                data: {
                                    imageUrl: image
                                },
                                success: function(repliedResult) {
                                    var responseJSON = repliedResult;
                                    if (responseJSON.status == 1) {
                                        currentObj.deleteImageFromAllCanvas(image);
                                        currentObj.uploadedImageSlider('removeItem', '', position);
                                        currentObj.hideLoader();
                                        current.setPrice(0, 0, current.options.defaultValues.size.value);
                                    }
                                }
                            });
                        }
                    },
                    {
                        text: "No",
                        class: "btn not_confirm",
                        click: function() {
                            $j(this).dialog("close");
                        }
                    }
                ],
                close: function(event, ui) {}
            });
        },
        deleteImageFromAllCanvas: function(image) {
            var current = this;

            var objectArray = [];
            $j.each(current.options.currentCanvas.getObjects(), function(objectIndex, currentObject) {
                if (currentObject.type == 'image' && currentObject.getSrc() == image) {
                    objectArray.push(currentObject);
                }
            });
            $j.each(objectArray, function(objectIndex, object) {
                var image = object.getSrc();

                if (object.id && object.type == 'image') {
                    var deleteImageBoxId = (object.id).split("_image")[0];
                    $j('.' + (current.options.currentCanvas.lowerCanvasEl.id) + '_layout_' + deleteImageBoxId).show();
                    $j('.' + (current.options.currentCanvas.lowerCanvasEl.id) + '_layout_' + deleteImageBoxId).removeClass('image-added');
                    $j('.' + (current.options.currentCanvas.lowerCanvasEl.id) + '_logo_' + deleteImageBoxId).show();
                }
                current.deleteImageFromUsedImageArray(image, current.options.currentCanvas.lowerCanvasEl.id, true);
                current.options.currentCanvas.remove(object);
                current.options.currentCanvas.renderAll();
            });
            current.EnableDisableAddtoCart();
        },
        documentKeyDownEvent: function(e) {
            var current = this;
            if (e.keyCode == 46) { //delete object
                if (!$j("#text2").is(':focus') && !$j("#angle_text").is(':focus')) {
                    current.deleteObject();
                }
            }

            if (e.ctrlKey == true && e.which == 67) // copy object
                if (current.options.currentObject && current.options.currentObject != null && current.options.currentObject.type != 'image') {
                    current.options.copyCutobject = fabric.util.object.clone(current.options.currentObject);
                }
            if (e.ctrlKey == true && e.which == 86 && (!$j("#text2").is(':focus') && !$j("#angle_text").is(':focus'))) { //paste object
                current.pasteObject();
            }

            if (e.ctrlKey == true && e.which == 88 && (!$j("#text2").is(':focus') && !$j("#angle_text").is(':focus'))) { // cut object
                if (current.options.currentObject && current.options.currentObject != null && current.options.currentObject.type != 'image') {
                    current.options.copyCutobject = current.options.currentObject;
                    current.options.currentCanvas.remove(current.options.currentObject);
                    current.options.currentObject = null;
                }
            }
        },
        pasteObject: function() {
            var current = this;
            if (current.options.copyCutobject) {
                if (current.options.copyCutobject.type == 'text' || current.options.copyCutobject.type == 'curvedText') {
                    var copiedObject = current.options.copyCutobject.clone();
                } else {
                    var copiedObject = fabric.util.object.clone(current.options.copyCutobject);
                }

                if (copiedObject.type == 'path-group') {
                    if (fabric.util.getKlass(copiedObject.type).async) {
                        copiedObject.clone(function(clone) {
                            clone.set({
                                left: fabric.util.getRandomInt(10, 200),
                                top: fabric.util.getRandomInt(10, 60),
                            });
                            current.options.currentCanvas.add(clone);

                            clone.setCoords();
                            current.options.currentCanvas.setActiveObject(clone);
                            current.options.currentCanvas.renderAll();
                        });
                    }
                } else {
                    copiedObject.set({
                        left: fabric.util.getRandomInt(10, 200),
                        top: fabric.util.getRandomInt(10, 60)
                    });
                    current.options.currentCanvas.add(copiedObject);

                    current.options.currentCanvas.setActiveObject(copiedObject);
                    copiedObject.setCoords();
                    current.options.currentCanvas.renderAll();
                }
            }
        },
        colorPicker: function(container, type) {
            var current = this;
            var defaultColor = '';
            var transparentColor = '';
            switch (type) {
                case 'canvasBackground':
                    current.options.colorPaletteWidth = '36px';
                    current.options.colorPaletteHeight = '36px';
                    current.options.colorPaletteMargin = '0px 9px 0px 0px';
                    defaultColor = current.options.canvasDefaultBackgrounColor;
                    var transparentColor = true;
                    break;
                case 'text':
                    current.options.colorPaletteWidth = '150px';
                    current.options.colorPaletteHeight = '23px';
                    current.options.colorPaletteMargin = '0';
                    defaultColor = current.options.pickerDefaultColor;
                    var transparentColor = false;
                    break;
            }

            /*Color picker embed code*/
            $j(container).spectrum({
                color: defaultColor,
                allowEmpty: transparentColor,
                showInput: true,
                className: "full-spectrum",
                showInitial: true,
                showPalette: true,
                showSelectionPalette: true,
                maxSelectionSize: 10,
                preferredFormat: "hex",
                localStorageKey: "spectrum.demo",
                colorPaletteWidth: current.options.colorPaletteWidth,
                colorPaletteHeight: current.options.colorPaletteHeight,
                colorPaletteMargin: current.options.colorPaletteMargin,
                move: function(color) {
                    if (color == null) {
                        current.removeBackgroundColor();
                    }

                },
                show: function() {

                },
                beforeShow: function() {

                },
                hide: function() {

                },
                change: function(color) {

                    if (type == "canvasBackground" && color != null) {
                        current.changeMugBackgroundColor(color.toHexString());
                        //$j('.theme_image').removeClass('active');
                    }

                    if (type == 'text' || type == 'curvedText') {
                        if (current.options.currentObject) {
                            current.options.currentObject.set({
                                fill: color.toHexString()
                            });
                            current.options.currentObject.canvas.renderAll();
                        }
                    }

                },
                cancel: function(color) {

                    if (type == "canvasBackground" && color == null) {
                        current.removeBackgroundColor();
                    } else if (type == "canvasBackground") {
                        current.changeMugBackgroundColor(color.toHexString());
                    }
                    if (type == 'text' || type == 'curvedText') {
                        if (current.options.currentObject) {
                            current.options.currentObject.set({
                                fill: color.toHexString()
                            });
                            current.options.currentObject.canvas.renderAll();
                        }
                    }
                },
                palette: [
                    ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
                        "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"
                    ],
                    ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"
                    ],
                    ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
                        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
                        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
                        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
                        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
                        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
                        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"
                    ]
                ]
            });
        },
        changeMugBackgroundColor: function(color) {
            var current = this;
            if (current.options.currentCanvas && current.options.currentCanvas != null) {
                current.options.currentCanvas.backgroundColor = color;
                current.options.currentCanvas.renderAll();
                current.options.defaultValues.defaultBackgroundColor = color;
                current.selectDefaultValues();
            }
        },
        removeBackgroundColor: function() {
            var current = this;
            if (current.options.currentCanvas && current.options.currentCanvas != null) {
                current.options.currentCanvas.backgroundColor = null; //current.options.canvasDefaultBackgrounColor;
                current.setColor('#canvas-background-color-picker', null);
                current.options.currentCanvas.renderAll();
                current.options.defaultValues.defaultBackgroundColor = null;
                current.selectDefaultValues();
                current.setPrice(0, 0, current.options.defaultValues.size.value);
            }
        },
        addClipart: function(svgsrc) {
            var current = this;
            if (current.options.currentCanvas) {
                fabric.loadSVGFromURL(svgsrc, function(objects, options) {
                    var loadedObject = fabric.util.groupSVGElements(objects, options);

                    var imgScalX = (current.options.currentCanvas.height / 2) / loadedObject.height;
                    var imgScalY = (current.options.currentCanvas.height / 2) / loadedObject.height;
                    loadedObject.set({
                        left: fabric.util.getRandomInt(0, 100),
                        top: 0,
                        scaleX: imgScalX,
                        scaleY: imgScalY,
                    });
                    current.options.currentCanvas.add(loadedObject);
                    current.options.currentCanvas.renderAll();
                });
            }
        },
        addTextInCanvas: function(el) {
            var current = this;
            if (current.options.currentText == null) {

                text = new fabric.Text($j("#text2").val(), {
                    left: fabric.util.getRandomInt(30, 400),
                    top: fabric.util.getRandomInt(60, 300),
                    opacity: 1,
                    fontFamily: $j("#textFontFamily").val(),
                    fontSize: $j("#textFontSize").val(),
                    cornerSize: 15,
                    fill: current.options.pickerDefaultColor
                });

                current.options.currentObject = current.options.currentText = text;
                current.options.currentCanvas.add(text);
                text.center();
                current.options.currentObject.setCoords();
                current.applyFontAccordingStyle();

            } else {
                current.options.currentObject.setText($j("#text2").val());
            }
            current.options.currentCanvas.setActiveObject(current.options.currentObject);
            if (current.options.currentObject.type == 'curvedText' && current.options.currentObject.text == '') {
                current.options.currentCanvas.remove(current.options.currentObject);
            }
            current.setAlignmentDiableEnable();
            current.options.currentCanvas.renderAll();
        },
        openTab: function(dataStep) {
            var current = this;

            if (dataStep == current.options.currentStep) return;

            $j('.menulink').removeClass('active');
            var visibility = $j('.results').is(':visible');
            $j('.results').hide();
            $j('.close_panel').show();
            $j('.ajax-file-upload-error').hide();

            if (current.options.windowWidth < 1025) {
                $j("#left-menu").removeClass('mobile-upload-all mobile-text-all mobile-size-all mobile-palette-all mobile-layout-all mobile-clipart-all');
                $j(".add-clip-art").mCustomScrollbar('destroy');
                $j('.close_panel').hide();
                if (dataStep == 'upload') {
                    $j("#left-menu").addClass('mobile-upload-all');
                } else if (dataStep == 'addtext') {
                    $j("#left-menu").addClass('mobile-text-all');
                } else if (dataStep == 'photomug_size') {
                    $j("#left-menu").addClass('mobile-size-all');
                } else if (dataStep == 'photomug_palettes_option') {
                    $j("#left-menu").addClass('mobile-palette-all');
                } else if (dataStep == 'layouts_panel') {
                    $j("#left-menu").addClass('mobile-layout-all');
                } else if (dataStep == 'clipart') {
                    $j("#left-menu").addClass('mobile-clipart-all');
                }
            }

            if (dataStep && dataStep != current.options.currentStep && !visibility) {
                $j('.results.' + dataStep).show();
                $j("#left-menu").animate({
                    marginLeft: "90px"
                }, 500);
                $j(".print-detail").animate({
                    "width": "-=400px"
                }, 500);
                $j("#slide-stage").animate({
                    marginLeft: "410px"
                }, 500);
                current.options.currentStep = dataStep;
                $j("[data-step='" + dataStep + "']").addClass('active');

            } else if (dataStep && dataStep != current.options.currentStep && visibility) { //alert(2);
                $j('.results.' + dataStep).show();
                current.options.currentStep = dataStep;
                $j("[data-step='" + dataStep + "']").addClass('active');
            } else {
                $j("#left-menu").animate({
                    marginLeft: "-330px"
                }, 500);
                $j(".print-detail").animate({
                    "width": "100%"
                }, 500);
                $j("#slide-stage").animate({
                    marginLeft: "90px"
                }, 500);
                current.options.currentStep = '';
                $j("[data-step='" + dataStep + "']").addClass('active');
                $j('.menulink').removeClass('active');
            }
            current.openSelectedCategory();
            current.updateNavigationTab(dataStep);
        },
        updateNavigationTab: function(dataStep) {
            var current = this;
            if (dataStep == '' || dataStep == undefined || dataStep == null) {
                dataStep = current.options.defaultTab;
            }
            var tabKeys = Object.keys(current.options.tabs);
            if (tabKeys[0] == dataStep) {
                $j('#previous_tab').hide();
                $j('#next_tab').show();
                $j('#next_tab').html('<span class="backcontinuetxt">Continue to</span>' + current.options.tabs[tabKeys[1]]);
                $j('#next_tab').attr('data-val', tabKeys[1]);

            } else if (tabKeys[tabKeys.length - 1] == dataStep) {
                $j('#previous_tab').show();
                $j('#next_tab').hide();
                $j('#previous_tab').html('<span class="backcontinuetxt">Back to</span>' + current.options.tabs[tabKeys[tabKeys.length - 2]]);
                $j('#previous_tab').attr('data-val', tabKeys[tabKeys.length - 2]);
            } else {
                var previousTabIndex = 0;
                var nextTabIndex = 0;
                $j.each(tabKeys, function(index, value) {
                    if (value == dataStep) {
                        previousTabIndex = index - 1;
                        nextTabIndex = index + 1;
                    }
                });
                $j('#previous_tab').show();
                $j('#previous_tab').html('<span class="backcontinuetxt">Back to</span>' + current.options.tabs[tabKeys[previousTabIndex]]);
                $j('#previous_tab').attr('data-val', tabKeys[previousTabIndex]);
                $j('#next_tab').show();
                $j('#next_tab').html('<span class="backcontinuetxt">Continue to</span>' + current.options.tabs[tabKeys[nextTabIndex]]);
                $j('#next_tab').attr('data-val', tabKeys[nextTabIndex]);
            }
        },
        openSelectedCategory: function() {
            var current = this;
            current.selectAccordian('.layouts_accordion', '.layout_categories', 'layout_category_' + current.options.defaultValues.layout.defaultLayoutCategory);
            if (current.options.defaultValues.defaultBackgroundColor == '') {
                $j('.sp-preview-inner').css('background-color', '#ffffff');
            } else {
                current.selectAccordian('.themes_accordion', '.theme_categories', 'theme_category_0');
                current.setColor('#canvas-background-color-picker', current.options.defaultValues.defaultBackgroundColor);
            }
        },
        fontSizeChangeEvent: function(el) {
            var current = this;
            if (current.options.currentObject.type == 'text' || current.options.currentObject.type == 'curvedText') {
                current.options.currentObject.setFontSize($j(el).val());
                current.options.currentObject.canvas.renderAll();
            }
        },
        applyFontAccordingStyle: function() {
            var current = this;

            if (current.options.fontDetails && current.options.currentObject && current.options.currentObject != null && (current.options.currentObject.type == 'text' || current.options.currentObject.type == 'curvedText' || current.options.currentObject.type == 'i-text')) {
                var fontFamily = current.options.currentObject.fontFamily;
                var newfontFamily = fontFamily;

                if (fontFamily) {
                    fontFamily = fontFamily.replace('_bi', '');
                    fontFamily = fontFamily.replace('_b', '');
                    fontFamily = fontFamily.replace('_i', '');
                    if (current.options.fontDetails[fontFamily]) {
                        if (current.options.currentObject.fontStyle == 'italic' && current.options.currentObject.fontWeight == 'bold') {
                            if (current.options.fontDetails[fontFamily]['bi']) {
                                newfontFamily = current.options.fontDetails[fontFamily]['bi'];
                            }
                        } else if (current.options.currentObject.fontWeight == 'bold') {
                            if (current.options.fontDetails[fontFamily]['b']) {
                                newfontFamily = current.options.fontDetails[fontFamily]['b'];
                            }
                        } else if (current.options.currentObject.fontStyle == 'italic') {
                            if (current.options.fontDetails[fontFamily]['i']) {
                                newfontFamily = current.options.fontDetails[fontFamily]['i'];
                            }
                        } else {
                            if (current.options.fontDetails[fontFamily]['n']) {
                                newfontFamily = current.options.fontDetails[fontFamily]['n'];
                            }
                        }
                    }

                    var fontObserv = new FontFaceObserver(newfontFamily);
                    fontObserv.load().then(function() {
                        current.options.currentObject.setFontFamily(newfontFamily);
                        current.options.currentObject.setCoords();
                        current.options.currentObject.canvas.renderAll();
                    });
                }
            }
        },
        fontFamilyChangeEvent: function(el) {
            var current = this;
            if (current.options.currentObject && (current.options.currentObject.type == 'text' || current.options.currentObject.type == 'curvedText')) {
                var fontFamily = $j(el).val();
                var newfontFamily = fontFamily;
                if (newfontFamily) {
                    newfontFamily = newfontFamily.replace('_bi', '');
                    newfontFamily = newfontFamily.replace('_b', '');
                    newfontFamily = newfontFamily.replace('_i', '');

                    if (current.options.fontDetails[newfontFamily]) {
                        if (current.options.currentObject.fontStyle == 'italic' && current.options.currentObject.fontWeight == 'bold') {
                            if (current.options.fontDetails[newfontFamily]['bi']) {
                                newfontFamily = current.options.fontDetails[newfontFamily]['bi'];
                                $j("#textBold").closest('a').addClass('active');
                                $j("#textItalic").closest('a').addClass('active');
                            } else {
                                $j("#textBold").closest('a').removeClass('active');
                                $j("#textItalic").closest('a').removeClass('active');
                                current.options.currentObject.fontStyle = "";
                                current.options.currentObject.fontWeight = "normal";
                            }
                        } else if (current.options.currentObject.fontWeight == 'bold') {
                            if (current.options.fontDetails[newfontFamily]['b']) {
                                newfontFamily = current.options.fontDetails[newfontFamily]['b'];
                                $j("#textBold").closest('a').addClass('active');
                            } else {
                                $j("#textBold").closest('a').removeClass('active');
                                current.options.currentObject.fontWeight = "normal";
                            }
                        } else if (current.options.currentObject.fontStyle == 'italic') {
                            if (current.options.fontDetails[newfontFamily]['i']) {
                                newfontFamily = current.options.fontDetails[newfontFamily]['i'];
                                $j("#textItalic").closest('a').addClass('active');
                            } else {
                                $j("#textItalic").closest('a').removeClass('active');
                                current.options.currentObject.fontStyle = "";
                            }
                        } else {
                            if (current.options.fontDetails[newfontFamily]['n']) {
                                newfontFamily = current.options.fontDetails[newfontFamily]['n'];
                            }
                        }
                    }
                }

                var fontObserv = new FontFaceObserver(newfontFamily);
                fontObserv.load().then(function() {
                    current.options.currentObject.setFontFamily(newfontFamily);
                    current.options.currentObject.canvas.renderAll();
                    current.applyFontAccordingStyle();
                }, function() {
                    current.options.currentObject.setFontFamily(newfontFamily);
                    current.options.currentObject.canvas.renderAll();
                    current.applyFontAccordingStyle();
                });
            }
        },
        textBoldClickEvent: function(el, fontName) {
            var current = this;
            fontName = fontName.replace('_bi', '');
            fontName = fontName.replace('_b', '');
            fontName = fontName.replace('_i', '');
            if (current.options.fontDetails && current.options.fontDetails[fontName] && (current.options.fontDetails[fontName]['b'] || current.options.fontDetails[fontName]['bi'])) {
                if (current.options.currentObject && current.options.currentObject != null && (current.options.currentObject.type == 'text' || current.options.currentObject.type == 'curvedText')) {
                    $j("#textBold").closest('a').removeClass('disabled');
                    if (current.options.currentObject.fontWeight == 'bold') {
                        current.options.currentObject.setFontWeight('normal');
                        $j("#textBold").closest('a').removeClass('active');
                    } else {
                        current.options.currentObject.setFontWeight('bold');
                        $j("#textBold").closest('a').addClass('active');

                        // Check if bolditalic is not available and italic font applied, than after applying bold style, italic font will be removed.
                        if (current.options.fontDetails[fontName]['bi'] == null && current.options.currentObject.fontStyle == 'italic') {
                            current.options.currentObject.setFontStyle('normal');
                            $j("#textItalic").closest('a').removeClass('active');
                        }
                    }

                    current.options.currentObject.canvas.renderAll();
                    current.options.currentCanvas.renderAll();
                    current.applyFontAccordingStyle();
                    current.options.currentObject.canvas.renderAll();
                    setTimeout(function() {
                        current.applyFontAccordingStyle();
                    }, 500);
                }
            } else {
                $j("#textBold").closest('a').addClass('disabled');
            }
        },
        textItalicClickEvent: function(el, fontName) {
            var current = this;
            fontName = fontName.replace('_bi', '');
            fontName = fontName.replace('_b', '');
            fontName = fontName.replace('_i', '');
            if (current.options.fontDetails && current.options.fontDetails[fontName] && (current.options.fontDetails[fontName]['i'] || current.options.fontDetails[fontName]['bi'])) {
                if (current.options.currentObject && current.options.currentObject != null && (current.options.currentObject.type == 'text' || current.options.currentObject.type == 'curvedText')) {
                    $j("#textItalic").closest('a').removeClass('disabled');
                    if (current.options.currentObject.fontStyle == 'italic') {
                        current.options.currentObject.setFontStyle('normal');
                        $j("#textItalic").closest('a').removeClass('active');
                    } else {
                        current.options.currentObject.setFontStyle('italic');
                        $j("#textItalic").closest('a').addClass('active');

                        // Check if bolditalic is not available and bold font applied, than after applying italic bold font will be removed.
                        if (current.options.fontDetails[fontName]['bi'] == null && current.options.currentObject.fontWeight == 'bold') {
                            current.options.currentObject.setFontWeight('normal');
                            $j("#textBold").closest('a').removeClass('active');
                        }
                    }
                    current.options.currentObject.canvas.renderAll();
                    current.options.currentCanvas.renderAll();
                    current.applyFontAccordingStyle();

                    current.options.currentObject.canvas.renderAll();
                    setTimeout(function() {
                        current.applyFontAccordingStyle();
                    }, 500);
                }
            } else {
                $j("#textItalic").closest('a').addClass('disabled');
            }
        },
        textUnderlineClickEvent: function(el) {
            var current = this;
            if (current.options.currentObject && current.options.currentObject != null && (current.options.currentObject.type == 'text' || current.options.currentObject.type == 'curvedText')) {
                if (current.options.currentObject.textDecoration == 'underline') {
                    current.options.currentObject.setTextDecoration('normal');
                    $j("#textUnderline").closest('a').removeClass('active');
                } else {
                    current.options.currentObject.setTextDecoration('underline');
                    $j("#textUnderline").closest('a').addClass('active');
                    $j("#textOveline").closest('a').removeClass('active');
                }
                current.options.currentObject.canvas.renderAll();
                current.options.currentCanvas.renderAll();
            }
        },
        textOvelineClickEvent: function(el) {
            var current = this;
            if (current.options.currentObject && current.options.currentObject != null && (current.options.currentObject.type == 'text' || current.options.currentObject.type == 'curvedText')) {
                if (current.options.currentObject.textDecoration == 'line-through') {
                    current.options.currentObject.setTextDecoration('normal');
                    $j("#textOveline").closest('a').removeClass('active');
                } else {
                    current.options.currentObject.setTextDecoration('line-through');
                    $j(el).closest('a').addClass('active');
                    $j("#textUnderline").closest('a').removeClass('active');
                }
                current.options.currentObject.canvas.renderAll();
                current.options.currentCanvas.renderAll();
            }
        },
        textAlignClickEvent: function(el) {
            var current = this;

            if (current.options.currentObject && current.options.currentObject != null && (current.options.currentObject.type == 'text' || current.options.currentObject.type == 'curvedText')) {
                $j(".text-align a").removeClass('active');
                $j(el).addClass('active');
                current.options.currentObject.setTextAlign($j(el).attr("alignment"));
                current.options.currentObject.canvas.renderAll();
                current.options.currentCanvas.renderAll();
            }
        },
        arcTextClicKEvent: function(el) {
            var current = this,
                currentObj = {},
                textSample = null;
            if (current.options.currentObject && current.options.currentObject != null && (current.options.currentObject.type == 'text' || current.options.currentObject.type == 'curvedText')) {
                currentObj = current.options.currentObject.toObject();
                if (el.target.checked == true) {
                    $j('#arcOptions').show();
                    $j('#radius').val(current.options.defaultArcTextRadius);
                    $j('#space').val(current.options.defaultArcTextSpacing);

                    delete currentObj.type;
                    currentObj.textAlign = 'center';
                    currentObj.radius = current.options.defaultArcTextRadius;
                    currentObj.spacing = current.options.defaultArcTextSpacing;
                    textSample = new fabric.CurvedText(current.options.currentText.text, currentObj);
                } else {
                    $j('#arcOptions').hide();
                    delete currentObj.type;
                    textSample = new fabric.Text(current.options.currentText.text, currentObj);
                }

                current.options.currentCanvas.remove(current.options.currentObject);
                current.options.currentCanvas.add(textSample).renderAll();
                current.options.currentObject = current.options.currentText = textSample;
                $j("#text2").val(current.options.currentText.text);
                current.setAlignmentDiableEnable();
                current.options.currentCanvas.setActiveObject(current.options.currentObject).renderAll();
            } else {
                el.preventDefault();
            }
        },
        arcTextRadiusSpacing: function(event) {
            var current = this;
            if (current.options.currentObject && current.options.currentObject != null && current.options.currentObject.type == 'curvedText') {
                current.options.currentObject.set($j('#' + event.target.id).attr('data-set'), event.target.value);
                current.options.currentCanvas.renderAll();
                var span = $j('#' + event.target.id).attr('data-span-selector');
                current.setArcRadiusSpacingValue(span, '#' + event.target.id);
            }
        },
        arcTextReverseClickEvent: function(event) {
            var current = this;
            if (current.options.currentObject && current.options.currentObject != null && current.options.currentObject.type == 'curvedText') {
                current.options.currentObject.set("reverse", event.target.checked);
                current.options.currentCanvas.renderAll();
            }
        },
        setTextAngle: function(event) {
            var current = this,
                textAngle = 0,
                keycode = event.which;
            if (current.options.currentObject && current.options.currentObject != null && current.options.currentObject.type == 'curvedText') {
                if ((event.shiftKey == false && (keycode == 8 || keycode == 46 || keycode == 36 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57) || (keycode >= 96 && keycode <= 105)))) {
                    setTimeout(function() {
                        textAngle = (event.target.value < 360) ? (event.target.value !== '') ? event.target.value : 0 : 359;
                        current.options.currentObject.setAngle(textAngle).setCoords();
                        current.options.currentCanvas.renderAll();
                        if (event.target.value >= 360) {
                            $j('#angle_text').val(textAngle);
                        }
                    }, 1000);
                } else {
                    event.preventDefault();
                    return false;
                }
            }
        },
        setArcRadiusSpacingValue: function(selector, sliderSelector) {
            var current = this;
            var range = $j(sliderSelector),
                value = range.val(),
                maxValue = range.attr('max');
            $j(selector).css('width', (value / maxValue * 100) + '%');
        },
        addBoxIncanvas: function(canvasObject, i) {
            var current = this;
            var pxLeft = (current.options.layout[i].left * canvasObject.width) / 100;
            var pxtop = (current.options.layout[i].top * canvasObject.height) / 100;
            var pxWidth = (current.options.layout[i].width * canvasObject.width) / 100;
            var pxHeight = (current.options.layout[i].height * canvasObject.height) / 100;

            var box = new fabric.Rect({
                left: pxLeft,
                top: pxtop,
                width: pxWidth,
                height: pxHeight,
                fill: current.options.layout[i].fill,
                lockScalingX: 'true',
                lockScalingY: 'true',
                selectable: false,
                stroke: current.options.boxBorderColor,
                strokeWidth: current.options.boxBorderColorWidth,
                hasRotatingPoint: false,
                borderColor: 'red',
                id: i,
                hoverCursor: 'default'
            });
            canvasObject.add(box);
            canvasObject.sendToBack(box);
            box = null;
            canvasObject.renderAll();
            current.createDiv(canvasObject, i, null);
        },
        createDiv: function(cnvsObject, i, Editbox) {
            var current = this;
            var division = '';
            var imagefound = false;
            if (Editbox == null) {
                var pxLeft = (current.options.layout[i].left * cnvsObject.width) / 100;
                var pxTop = (current.options.layout[i].top * cnvsObject.height) / 100;
                var pxWidth = (current.options.layout[i].width * cnvsObject.width) / 100;
                var pxHeight = (current.options.layout[i].height * cnvsObject.height) / 100;

                division += '<div class="demo-image ' + cnvsObject.lowerCanvasEl.id + '_layout_' + i + '" box-id="' + i + '" style="display: block; width: ' + pxWidth + 'px; height: ' + pxHeight + 'px;left:' + pxLeft + 'px; top:' + pxTop + 'px;"><div class="' + cnvsObject.lowerCanvasEl.id + '_logo_' + i + ' demo-image-default"><a><i class="fa fa-upload" aria-hidden="true"></i></a></div></div>';
            } else {
                cnvsObject.getObjects().forEach(function(o) {
                    if (o.type == 'image') {
                        if (o.id == i + '_image') {
                            imagefound = true;
                            return false;
                        }
                    }
                });

                if (imagefound) {
                    division = ''
                    division += '<div class="demo-image ' + cnvsObject.lowerCanvasEl.id + '_layout_' + i + ' image-added" box-id="' + i + '" style="display: none; width: ' + Editbox.width + 'px; height: ' + Editbox.height + 'px;left:' + Editbox.left + 'px; top:' + Editbox.top + 'px;"><div class="' + cnvsObject.lowerCanvasEl.id + '_logo_' + i + ' demo-image-default" style="display: none;"><a><i class="fa fa-upload" aria-hidden="true"></i></a></div></div>';
                } else {
                    division = ''
                    division += '<div class="demo-image ' + cnvsObject.lowerCanvasEl.id + '_layout_' + i + '" box-id="' + i + '" style="display: block; width: ' + Editbox.width + 'px; height: ' + Editbox.height + 'px;left:' + Editbox.left + 'px; top:' + Editbox.top + 'px;"><div class="' + cnvsObject.lowerCanvasEl.id + '_logo_' + i + ' demo-image-default" ><a><i class="fa fa-upload" aria-hidden="true"></i></a></div></div>';
                }
            }

            $j(cnvsObject.wrapperEl).append(division);

            $j(".demo-image").droppable({
                drop: function(event, ui) {
                    current.options.oldImage = '';
                    if (current.options.draggedImgSrc != null) {
                        current.setActiveBox(this);
                        current.dropImageInBox(current.options.draggedImgSrc, current.options.activeBoxId + '_image', current.options.boxLeft, current.options.boxTop, current.options.boxWidth, current.options.boxHeight, current.options.oldImage);
                        current.options.currentCanvas.discardActiveObject();
                        current.options.currentCanvas.renderAll();

                    }
                }
            });
        },
        dropImageInBox: function(imageSRC, imageId, boxLeft, boxTop, boxWidth, boxHeight, oldDeletedImage) {

            var current = this;
            current.options.uploadLinkClicked = false;

            fabric.Image.fromURL(imageSRC, function(img) {
                var ratioOfHeight = img.height / boxHeight;
                var ratioOfWidth = img.width / boxWidth;

                if (ratioOfHeight >= ratioOfWidth) {
                    img.set({
                        perPixelTargetFind: true,
                        scaleX: 1 / ratioOfWidth,
                        scaleY: 1 / ratioOfWidth,
                        id: imageId,
                        left: boxLeft,
                        top: boxTop
                    });
                } else {
                    img.set({
                        perPixelTargetFind: true,
                        scaleX: 1 / ratioOfHeight,
                        scaleY: 1 / ratioOfHeight,
                        id: imageId,
                        left: boxLeft,
                        top: boxTop
                    });
                }
                img.set({
                    lockMovementX: true,
                    lockMovementY: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockRotation: true,
                    hasBorders: false,
                    hasControls: false
                });

                current.options.currentCanvas.add(img);
                current.options.currentCanvas.setActiveObject(img);
                current.options.currentCanvas.renderAll();

                $j('.' + (current.options.currentCanvas.lowerCanvasEl.id) + '_layout_' + current.options.activeBoxId).hide();
                $j('.' + (current.options.currentCanvas.lowerCanvasEl.id) + '_layout_' + current.options.activeBoxId).addClass('image-added');
                $j('.' + (current.options.currentCanvas.lowerCanvasEl.id) + '_logo_' + current.options.activeBoxId).hide();
                $j('.image-added').hide();

                img.clipTo = function(ctx) {
                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.rect(boxLeft + current.options.boxBorderColorWidth, boxTop + current.options.boxBorderColorWidth, boxWidth - current.options.boxBorderColorWidth, boxHeight - current.options.boxBorderColorWidth);
                    ctx.restore();
                };

                var textAndClipartObjects = [];
                current.options.currentCanvas.getObjects().forEach(function(o) {
                    if (o.type == 'text' || o.type == 'curvedText' || o.type == 'path-group') {
                        textAndClipartObjects.push(o);
                    }
                });

                for (var i = 0, len = textAndClipartObjects.length; i < (len); i++) {
                    current.options.currentCanvas.bringToFront(textAndClipartObjects[i]);
                }

                current.options.currentCanvas.renderAll();

                var fotoliaString = current.options.draggedImgSrc.match("-_-_-(.*)_test");
                fotoliaString = parseInt(fotoliaString[1]);
                current.addImageInUsedImageArray(current.options.draggedImgSrc);
                current.hideShowUsedImages();
                current.EnableDisableAddtoCart();
                current.options.draggedImgSrc = null;

                if (fotoliaString > 0 && !current.options.fotoliaMessageShow) {
                    $j(".fotolia-note .general-message").hide();
                    $j(".fotolia-note .fotolia-message").fadeIn(2000).delay(5000).fadeOut(2000, function() {
                        $j(".fotolia-note .general-message").fadeIn(2000);
                    });
                    current.options.fotoliaMessageShow = true;
                }

                if (oldDeletedImage != '' && oldDeletedImage != undefined && oldDeletedImage != null) {
                    current.deleteImageFromUsedImageArray(oldDeletedImage, '', false);
                    current.checkdeleteImageUsedInCanvas(oldDeletedImage);
                }

                if (fotoliaString > 0) {
                    img.set({
                        fotolia_id: fotoliaString
                    });
                } else {
                    img.set({
                        fotolia_id: 0
                    });
                }
                img.set({
                    original_image_url: imageSRC
                });
                img = null;
                current.setPrice(0, 0, current.options.defaultValues.size.value);
            });
        },

        setActiveBox: function(el) {
            var current = this;
            current.options.activeBoxId = $j(el).attr('box-id');
            current.options.currentCanvas.getObjects().forEach(function(o) {
                if (o.id === current.options.activeBoxId) {
                    current.options.currentCanvas.setActiveObject(o);
                }
                if (o.id === current.options.activeBoxId + '_image') {
                    current.options.oldImage = o.getSrc();
                    current.options.currentCanvas.remove(o);
                }
            })
        },

        uploadedImageSlider: function(type, content, index) {
            var uploadedImage = $j('.uploded-images');
            uploadedImage.on('changed.owl.carousel', function(e) {
                var itemCount = e.item.count;
                if (itemCount > 0) {
                    e.property.value.loop = false;
                }
            });
            if (type == 'addItem') {
                uploadedImage.trigger('add.owl.carousel', [content, 0]).trigger('refresh.owl.carousel');
                uploadedImage.trigger('to.owl.carousel', [0, 100]).trigger('refresh.owl.carousel');
            } else if (type == 'removeItem') {
                uploadedImage.trigger('remove.owl.carousel', index).trigger('refresh.owl.carousel');
            } else {
                uploadedImage.owlCarousel({
                    loop: true,
                    margin: 5,
                    items: 4,
                    slideBy: 4,
                    nav: true,
                    dots: false,
                    autoplay: false,
                    autoplayTimeout: 6000,
                    autoplayHoverPause: true,
                    touchDrag: false,
                    mouseDrag: false,
                    responsiveClass: true,
                    responsive: {
                        0: {
                            items: 4,
                            slideBy: 4,
                        },
                        360: {
                            items: 5,
                            slideBy: 5,
                        },
                        480: {
                            items: 6,
                            slideBy: 6,
                        },
                        640: {
                            items: 7,
                            slideBy: 7,
                        },
                        767: {
                            items: 9,
                            slideBy: 9,
                            margin: 4,
                        },
                        980: {
                            items: 11,
                            slideBy: 11,
                        },
                        1025: {
                            items: 5,
                            slideBy: 5,
                        },
                        1200: {
                            items: 4,
                            slideBy: 4,
                        }
                    }
                });
            }
        },
        loadPreviewHeartHandleWhiteMug1: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_1");
            var ctx = canvas.getContext("2d");
            var xOffset = 140; //left padding
            var yOffset = 95; //top padding
            var scaleFactor = 1; //iw / (3 * a);
            var a = 92.0; //image width
            var b = 14; //round ness
            var mugHeight = 190;

            current.showLoader();
            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_left.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                img.src = current.options.currentCanvas.toDataURL();
                img.onload = function() {
                    var iw = img.width;
                    var ih = img.height;
                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768) {
                            ctx.drawImage(img, X / 2, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewHeartHandleWhiteMug2: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_2");
            var ctx = canvas.getContext("2d");
            var xOffset = 85; //left padding
            var yOffset = 95; //top padding
            var scaleFactor = 1; //iw / (3 * a);
            var a = 94.0; //image width
            var b = 14; //round ness
            var mugHeight = 190;
            current.showLoader();
            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_front.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                img.src = current.options.currentCanvas.toDataURL();
                img.onload = function() {
                    var iw = img.width;
                    var ih = img.height;
                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768) {
                            ctx.drawImage(img, X / 2.5, 0, iw / 1.7, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, iw / 1.7, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewHeartHandleWhiteMug3: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_3");
            var ctx = canvas.getContext("2d");
            var xOffset = 34; //left padding
            var yOffset = 95; //top padding
            var scaleFactor = 1.3; //iw / (3 * a);
            var a = 100.0; //image width
            var b = 14; //round ness
            var mugHeight = 190;
            current.showLoader();
            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_right.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                var tempHeight = parseInt(current.options.currentCanvas.height);
                if (current.options.windowWidth < 360) {
                    var canvasPart = 1.65;
                } else if (current.options.windowWidth < 768) {
                    var canvasPart = 1.67;
                } else {
                    var canvasPart = 2.5;
                }
                var tempWidth = parseInt(current.options.currentCanvas.width / canvasPart);
                var tempLeft = parseInt(current.options.currentCanvas.width - (current.options.currentCanvas.width / canvasPart));
                var cuurCTX = current.options.currentCanvas.getContext("2d");
                var imageData = cuurCTX.getImageData(tempLeft, 0, tempWidth, tempHeight);

                var tempCanvs = document.createElement("canvas");
                tempCanvs.width = tempWidth;
                tempCanvs.height = tempHeight;
                var tempCTX = tempCanvs.getContext("2d");
                tempCTX.putImageData(imageData, 0, 0);

                img.src = tempCanvs.toDataURL();

                img.onload = function() {

                    var iw = img.width;
                    var ih = img.height;

                    if (iw < 300)
                        iw = 300;

                    scaleFactor = 1;

                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768 && current.options.windowWidth > 359) {
                            ctx.drawImage(img, X * .76, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else if (current.options.windowWidth < 360) {
                            ctx.drawImage(img, X * .67, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewCutHeartHandleWhiteMug1: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_1");
            var ctx = canvas.getContext("2d");
            var xOffset = 160; //left padding
            var yOffset = 80; //top padding
            var scaleFactor = 1.5; //iw / (3 * a);
            var a = 68.0; //image width
            var b = 10; //round ness
            var mugHeight = 205;

            current.showLoader();
            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_left.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                img.src = current.options.currentCanvas.toDataURL();
                img.onload = function() {
                    var iw = img.width;
                    var ih = img.height;
                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768) {
                            ctx.drawImage(img, X / 2, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewCutHeartHandleWhiteMug2: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_2");
            var ctx = canvas.getContext("2d");
            var xOffset = 70; //left padding
            var yOffset = 80; //top padding
            var scaleFactor = 1.3; //iw / (3 * a);
            var a = 101.0; //image width
            var b = 14; //round ness
            var mugHeight = 202;
            current.showLoader();
            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_front.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                img.src = current.options.currentCanvas.toDataURL();
                img.onload = function() {
                    var iw = img.width;
                    var ih = img.height;
                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768) {
                            ctx.drawImage(img, X / 2.5, 0, iw / 1.7, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, iw / 1.7, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewCutHeartHandleWhiteMug3: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_3");
            var ctx = canvas.getContext("2d");
            var xOffset = 59; //left padding
            var yOffset = 82; //top padding
            var scaleFactor = 1; //iw / (3 * a);
            var a = 67.0; //image width
            var b = 10; //round ness
            var mugHeight = 202;
            current.showLoader();
            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_right.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                var tempHeight = parseInt(current.options.currentCanvas.height);

                if (current.options.windowWidth < 768) {
                    var canvasPart = 2.3;
                } else {
                    var canvasPart = 3.5;
                }
                var tempWidth = parseInt(current.options.currentCanvas.width / canvasPart);
                var tempLeft = parseInt(current.options.currentCanvas.width - (current.options.currentCanvas.width / canvasPart));
                var cuurCTX = current.options.currentCanvas.getContext("2d");
                var imageData = cuurCTX.getImageData(tempLeft, 0, tempWidth, tempHeight);

                var tempCanvs = document.createElement("canvas");
                tempCanvs.width = tempWidth;
                tempCanvs.height = tempHeight;
                var tempCTX = tempCanvs.getContext("2d");
                tempCTX.putImageData(imageData, 0, 0);

                img.src = tempCanvs.toDataURL();

                img.onload = function() {

                    var iw = img.width;
                    var ih = img.height;

                    if (iw < 300)
                        iw = 300;

                    scaleFactor = 1;

                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768 && current.options.windowWidth > 359) {
                            ctx.drawImage(img, X * .76, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else if (current.options.windowWidth < 360) {
                            ctx.drawImage(img, X * .67, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewTeaMug1: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_1");
            var ctx = canvas.getContext("2d");
            var xOffset = 108; //left padding
            var yOffset = 85; //top padding
            var scaleFactor = 1.3; //iw / (3 * a);
            var a = 94.0; //image width
            var b = 14; //round ness
            var mugHeight = 206;

            current.showLoader();
            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_left.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                img.src = current.options.currentCanvas.toDataURL();
                img.onload = function() {
                    var iw = img.width;
                    var ih = img.height;
                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768) {
                            ctx.drawImage(img, X / 2, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewTeaMug2: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_2");
            var ctx = canvas.getContext("2d");
            var xOffset = 82; //left padding
            var yOffset = 85; //top padding
            var scaleFactor = 1.3; //iw / (3 * a);
            var a = 95.0; //image width
            var b = 14; //round ness
            var mugHeight = 206;
            current.showLoader();
            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_front.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                img.src = current.options.currentCanvas.toDataURL();
                img.onload = function() {
                    var iw = img.width;
                    var ih = img.height;
                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768) {
                            ctx.drawImage(img, X / 2.5, 0, iw / 1.7, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, iw / 1.7, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewTeaMug3: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_3");
            var ctx = canvas.getContext("2d");
            var xOffset = 65; //left padding
            var yOffset = 85; //top padding
            var scaleFactor = 1.3; //iw / (3 * a);
            var a = 96.0; //image width
            var b = 14; //round ness
            var mugHeight = 206;
            current.showLoader();
            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_right.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                var tempHeight = parseInt(current.options.currentCanvas.height);

                if (current.options.windowWidth < 768) {
                    var canvasPart = 1.65;
                } else {
                    var canvasPart = 2.5;
                }
                var tempWidth = parseInt(current.options.currentCanvas.width / canvasPart);
                var tempLeft = parseInt(current.options.currentCanvas.width - (current.options.currentCanvas.width / canvasPart));
                var cuurCTX = current.options.currentCanvas.getContext("2d");
                var imageData = cuurCTX.getImageData(tempLeft, 0, tempWidth, tempHeight);

                var tempCanvs = document.createElement("canvas");
                tempCanvs.width = tempWidth;
                tempCanvs.height = tempHeight;
                var tempCTX = tempCanvs.getContext("2d");
                tempCTX.putImageData(imageData, 0, 0);

                img.src = tempCanvs.toDataURL();

                img.onload = function() {

                    var iw = img.width;
                    var ih = img.height;

                    if (iw < 300)
                        iw = 300;

                    scaleFactor = 1;

                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768 && current.options.windowWidth > 359) {
                            ctx.drawImage(img, X * .76, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else if (current.options.windowWidth < 360) {
                            ctx.drawImage(img, X * .67, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewBeerMug1: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_1");
            var ctx = canvas.getContext("2d");
            var xOffset = 125; //left padding
            var yOffset = 62; //top padding
            var scaleFactor = 1.3; //iw / (3 * a);
            var a = 72.0; //image width
            var b = 16; //round ness
            var mugHeight = 210;

            current.showLoader();
            var context = current.options.currentCanvas.getContext('2d'),
                imageData = context.getImageData(0, 0, current.options.currentCanvas.width, current.options.currentCanvas.height),
                data = imageData.data,
                noise = 40,
                rand;
            for (var i = 0, len = data.length; i < len; i += 4) {
                rand = (0.5 - Math.random()) * noise;
                data[i] += rand;
                data[i + 1] += rand;
                data[i + 2] += rand;
            }
            var effectCanvas = document.createElement("CANVAS");
            effectCanvas.width = current.options.currentCanvas.width;
            effectCanvas.height = current.options.currentCanvas.height;
            var effectContext = effectCanvas.getContext('2d');
            effectContext.putImageData(imageData, 0, 0);

            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_left.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                img.src = effectCanvas.toDataURL(); //current.options.currentCanvas.toDataURL();
                img.onload = function() {
                    var iw = img.width;
                    var ih = img.height;
                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768) {
                            ctx.drawImage(img, X / 2, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewBeerMug2: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_2");
            var ctx = canvas.getContext("2d");
            var xOffset = 123; //left padding
            var yOffset = 62; //top padding
            var scaleFactor = 1.3; //iw / (3 * a);
            var a = 73.0; //image width
            var b = 16; //round ness
            var mugHeight = 210;
            current.showLoader();

            var context = current.options.currentCanvas.getContext('2d'),
                imageData = context.getImageData(0, 0, current.options.currentCanvas.width, current.options.currentCanvas.height),
                data = imageData.data,
                noise = 40,
                rand;
            for (var i = 0, len = data.length; i < len; i += 4) {
                rand = (0.5 - Math.random()) * noise;
                data[i] += rand;
                data[i + 1] += rand;
                data[i + 2] += rand;
            }
            var effectCanvas = document.createElement("CANVAS");
            effectCanvas.width = current.options.currentCanvas.width;
            effectCanvas.height = current.options.currentCanvas.height;
            var effectContext = effectCanvas.getContext('2d');
            effectContext.putImageData(imageData, 0, 0);

            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_front.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                img.src = effectCanvas.toDataURL(); //current.options.currentCanvas.toDataURL();
                img.onload = function() {
                    var iw = img.width;
                    var ih = img.height;
                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768) {
                            ctx.drawImage(img, X / 2.5, 0, iw / 1.7, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, iw / 1.7, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewBeerMug3: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_3");
            var ctx = canvas.getContext("2d");
            var xOffset = 88; //left padding
            var yOffset = 62; //top padding
            var scaleFactor = 1.3; //iw / (3 * a);
            var a = 76.0; //image width
            var b = 12; //round ness
            var mugHeight = 210;
            current.showLoader();

            var context = current.options.currentCanvas.getContext('2d'),
                imageData = context.getImageData(0, 0, current.options.currentCanvas.width, current.options.currentCanvas.height),
                data = imageData.data,
                noise = 40,
                rand;
            for (var i = 0, len = data.length; i < len; i += 4) {
                rand = (0.5 - Math.random()) * noise;
                data[i] += rand;
                data[i + 1] += rand;
                data[i + 2] += rand;
            }
            var effectCanvas = document.createElement("CANVAS");
            effectCanvas.width = current.options.currentCanvas.width;
            effectCanvas.height = current.options.currentCanvas.height;
            var effectContext = effectCanvas.getContext('2d');
            effectContext.putImageData(imageData, 0, 0);

            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_right.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                var tempHeight = parseInt(current.options.currentCanvas.height);
                if (current.options.windowWidth < 768) {
                    var canvasPart = 1.92;
                } else if (current.options.windowWidth < 768) {
                    var canvasPart = 1.69;
                } else {
                    var canvasPart = 2.6;
                }
                var tempWidth = parseInt(current.options.currentCanvas.width / canvasPart);
                var tempLeft = parseInt(current.options.currentCanvas.width - (current.options.currentCanvas.width / canvasPart));
                // var cuurCTX = current.options.currentCanvas.getContext("2d");
                // var imageData = cuurCTX.getImageData(tempLeft, 0, tempWidth, tempHeight);
                var newImageData = effectContext.getImageData(tempLeft, 0, tempWidth, tempHeight);

                var tempCanvs = document.createElement("canvas");
                tempCanvs.width = tempWidth;
                tempCanvs.height = tempHeight;
                var tempCTX = tempCanvs.getContext("2d");
                tempCTX.putImageData(newImageData, 0, 0);

                img.src = tempCanvs.toDataURL();

                img.onload = function() {

                    var iw = img.width;
                    var ih = img.height;

                    if (iw < 300)
                        iw = 300;

                    scaleFactor = 1.03;
                    //scaleFactor = iw / (3 * a);

                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768 && current.options.windowWidth > 359) {
                            ctx.drawImage(img, X * .76, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else if (current.options.windowWidth < 360) {
                            ctx.drawImage(img, X * .67, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewFrostedMug1: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_1");
            var ctx = canvas.getContext("2d");
            var xOffset = 104; //left padding
            var yOffset = 107; //top padding
            //var scaleFactor = 1.3; //iw / (3 * a);
            var a = 89.0; //image width
            var b = 19; //round ness
            var mugHeight = 185;

            //var scaleFactor = 1.3; //iw / (3 * a);                        
            current.showLoader();

            var context = current.options.currentCanvas.getContext('2d'),
                imageData = context.getImageData(0, 0, current.options.currentCanvas.width, current.options.currentCanvas.height),
                data = imageData.data,
                noise = 40,
                rand;
            for (var i = 0, len = data.length; i < len; i += 4) {
                rand = (0.5 - Math.random()) * noise;
                data[i] += rand;
                data[i + 1] += rand;
                data[i + 2] += rand;
            }
            var effectCanvas = document.createElement("CANVAS");
            effectCanvas.width = current.options.currentCanvas.width;
            effectCanvas.height = current.options.currentCanvas.height;
            var effectContext = effectCanvas.getContext('2d');
            effectContext.putImageData(imageData, 0, 0);

            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_left.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                img.src = effectCanvas.toDataURL(); //current.options.currentCanvas.toDataURL();
                img.onload = function() {
                    var iw = img.width;
                    var ih = img.height;
                    var scaleFactor = iw / (4 * a);
                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768) {
                            ctx.drawImage(img, X / 2, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewFrostedMug2: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_2");
            var ctx = canvas.getContext("2d");
            var xOffset = 75; //left padding
            var yOffset = 107; //top padding
            //var scaleFactor = 1.3; //iw / (3 * a);
            var a = 89.0; //image width
            var b = 19; //round ness
            var mugHeight = 185;
            current.showLoader();

            var context = current.options.currentCanvas.getContext('2d'),
                imageData = context.getImageData(0, 0, current.options.currentCanvas.width, current.options.currentCanvas.height),
                data = imageData.data,
                noise = 40,
                rand;
            for (var i = 0, len = data.length; i < len; i += 4) {
                rand = (0.5 - Math.random()) * noise;
                data[i] += rand;
                data[i + 1] += rand;
                data[i + 2] += rand;
            }
            var effectCanvas = document.createElement("CANVAS");
            effectCanvas.width = current.options.currentCanvas.width;
            effectCanvas.height = current.options.currentCanvas.height;
            var effectContext = effectCanvas.getContext('2d');
            effectContext.putImageData(imageData, 0, 0);

            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_front.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                img.src = effectCanvas.toDataURL(); //current.options.currentCanvas.toDataURL();
                img.onload = function() {
                    var iw = img.width;
                    var ih = img.height;
                    var scaleFactor = iw / (4 * a);
                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768) {
                            ctx.drawImage(img, X / 2.5, 0, iw / 1.7, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, iw / 1.7, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewFrostedMug3: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_3");
            var ctx = canvas.getContext("2d");
            var xOffset = 75; //left padding
            var yOffset = 107; //top padding
            var scaleFactor = 1.3; //iw / (3 * a);
            var a = 88.0; //image width
            var b = 18; //round ness
            var mugHeight = 185;
            current.showLoader();

            var context = current.options.currentCanvas.getContext('2d'),
                imageData = context.getImageData(0, 0, current.options.currentCanvas.width, current.options.currentCanvas.height),
                data = imageData.data,
                noise = 40,
                rand;
            for (var i = 0, len = data.length; i < len; i += 4) {
                rand = (0.5 - Math.random()) * noise;
                data[i] += rand;
                data[i + 1] += rand;
                data[i + 2] += rand;
            }
            var effectCanvas = document.createElement("CANVAS");
            effectCanvas.width = current.options.currentCanvas.width;
            effectCanvas.height = current.options.currentCanvas.height;
            var effectContext = effectCanvas.getContext('2d');
            effectContext.putImageData(imageData, 0, 0);

            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.photomugType.value + '-' + current.options.defaultValues.size.label + '-' + 'mug_right.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                var tempHeight = parseInt(current.options.currentCanvas.height);

                if (current.options.windowWidth < 360) {
                    var canvasPart = 1.68;
                } else if (current.options.windowWidth < 768) {
                    var canvasPart = 1.7;
                } else {
                    var canvasPart = 2.5;
                }
                var tempWidth = parseInt(current.options.currentCanvas.width / canvasPart);
                var tempLeft = parseInt(current.options.currentCanvas.width - (current.options.currentCanvas.width / canvasPart));
                //var cuurCTX = current.options.currentCanvas.getContext("2d");
                //var imageData = cuurCTX.getImageData(tempLeft, 0, tempWidth, tempHeight);
                var newImageData = effectContext.getImageData(tempLeft, 0, tempWidth, tempHeight);

                var tempCanvs = document.createElement("canvas");
                tempCanvs.width = tempWidth;
                tempCanvs.height = tempHeight;
                var tempCTX = tempCanvs.getContext("2d");
                tempCTX.putImageData(newImageData, 0, 0);

                img.src = tempCanvs.toDataURL();

                img.onload = function() {

                    var iw = img.width;
                    var ih = img.height;
                    if (iw < 300)
                        iw = 300;

                    scaleFactor = 1.01; //iw / (3 * a);                    

                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768 && current.options.windowWidth > 359) {
                            ctx.drawImage(img, X * .76, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else if (current.options.windowWidth < 360) {
                            ctx.drawImage(img, X * .67, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewCanvas1: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_1");
            var ctx = canvas.getContext("2d");
            var xOffset = 98; //left padding
            var yOffset = 115; //top padding
            var scaleFactor = 1.3; //iw / (3 * a);
            var a = 78.0; //image width
            var b = 14; //round ness
            var mugHeight = 165;
            current.showLoader();
            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.size.label + '-' + 'mug_left.png';

            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;
                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();

            };

            function loadUpperIMage() {
                var img = new Image();
                img.src = current.options.currentCanvas.toDataURL();

                img.onload = function() {
                    var iw = img.width;
                    var ih = img.height;

                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768) {
                            ctx.drawImage(img, X / 2, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }

        },
        loadPreviewCanvas2: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_2");
            var ctx = canvas.getContext("2d");
            var xOffset = 98; //left padding
            var yOffset = 115; //top padding
            var scaleFactor = 1.3; //iw / (3 * a);
            var a = 78.0; //image width
            var b = 14; //round ness
            var mugHeight = 165;
            current.showLoader();
            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.size.label + '-' + 'mug_front.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;

                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();

                img.src = current.options.currentCanvas.toDataURL();

                img.onload = function() {

                    var iw = img.width;
                    var ih = img.height;

                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768) {
                            ctx.drawImage(img, X / 2.5, 0, iw / 1.7, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, iw / 1.7, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        loadPreviewCanvas3: function() {
            var current = this;
            var canvas = document.getElementById("previewcanvas_3");
            var ctx = canvas.getContext("2d");
            var xOffset = 97; //left padding
            var yOffset = 115; //top padding
            var scaleFactor = 1.3; //iw / (3 * a);
            var a = 80.0; //image width
            var b = 14; //round ness
            var mugHeight = 165;
            current.showLoader();
            var productImg = new Image();
            productImg.src = current.options.skinUrl + 'photomug/preview/' + current.options.defaultValues.palette_color.label + '/' + current.options.defaultValues.size.label + '-' + 'mug_right.png';
            productImg.onload = function() {
                canvas.width = productImg.width;
                canvas.height = productImg.height;

                ctx.drawImage(productImg, 0, 0, productImg.width, productImg.height, 0, 0, canvas.width, canvas.height);
                loadUpperIMage();
                current.hideLoader();
            };

            function loadUpperIMage() {
                var img = new Image();
                var tempHeight = parseInt(current.options.currentCanvas.height);

                if (current.options.windowWidth < 768) {
                    var canvasPart = 2
                } else {
                    var canvasPart = 3
                }
                var tempWidth = parseInt(current.options.currentCanvas.width / canvasPart);
                var tempLeft = parseInt(current.options.currentCanvas.width - (current.options.currentCanvas.width / canvasPart));
                var cuurCTX = current.options.currentCanvas.getContext("2d");
                var imageData = cuurCTX.getImageData(tempLeft, 0, tempWidth, tempHeight);

                var tempCanvs = document.createElement("canvas");
                tempCanvs.width = tempWidth;
                tempCanvs.height = tempHeight;
                var tempCTX = tempCanvs.getContext("2d");
                tempCTX.putImageData(imageData, 0, 0);

                img.src = tempCanvs.toDataURL();

                img.onload = function() {

                    var iw = img.width;
                    var ih = img.height;

                    if (iw < 300)
                        iw = 300;

                    scaleFactor = 1.01;

                    for (var X = 0; X < iw; X += 1) {
                        var y = b / a * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
                        if (current.options.windowWidth < 768 && current.options.windowWidth > 359) {
                            ctx.drawImage(img, X * .76, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else if (current.options.windowWidth < 360) {
                            ctx.drawImage(img, X * .67, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        } else {
                            ctx.drawImage(img, X * scaleFactor, 0, 1, ih, X + xOffset, y + yOffset, 1, mugHeight);
                        }
                    }
                };
            }
        },
        setAlignmentDiableEnable: function() {
            var current = this;
            if (current.options.currentObject && current.options.currentObject.type == "curvedText") {
                $j('.text-align').addClass("disabled").attr('disabled', true);
            } else {
                $j('.text-align').removeClass("disabled").attr('disabled', false);
            }
        },
    }
    return designtoolPhotomug;
});