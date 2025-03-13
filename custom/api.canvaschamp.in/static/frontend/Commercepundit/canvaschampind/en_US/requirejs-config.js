(function(require) {
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            waitSeconds: 0,
            map: {
                '*': {
                    'ko': 'knockoutjs/knockout',
                    'knockout': 'knockoutjs/knockout',
                    'mageUtils': 'mage/utils/main',
                    'rjsResolver': 'mage/requirejs/resolver'
                }
            },
            shim: {
                'jquery/jquery-migrate': ['jquery'],
                'jquery/jstree/jquery.hotkeys': ['jquery'],
                'jquery/hover-intent': ['jquery'],
                'mage/adminhtml/backup': ['prototype'],
                'mage/captcha': ['prototype'],
                'mage/new-gallery': ['jquery'],
                'mage/webapi': ['jquery'],
                'jquery/ui': ['jquery'],
                'MutationObserver': ['es6-collections'],
                'matchMedia': {
                    'exports': 'mediaCheck'
                },
                'magnifier/magnifier': ['jquery']
            },
            paths: {
                'jquery/validate': 'jquery/jquery.validate',
                'jquery/hover-intent': 'jquery/jquery.hoverIntent',
                'jquery/file-uploader': 'jquery/fileUploader/jquery.fileuploader',
                'prototype': 'legacy-build.min',
                'jquery/jquery-storageapi': 'jquery/jquery.storageapi.min',
                'text': 'mage/requirejs/text',
                'domReady': 'requirejs/domReady',
                'spectrum': 'jquery/spectrum/spectrum',
                'tinycolor': 'jquery/spectrum/tinycolor',
                'jquery-ui-modules': 'jquery/ui-modules'
            },
            deps: [
                'jquery/jquery-migrate'
            ],
            config: {
                mixins: {
                    'jquery/jstree/jquery.jstree': {
                        'mage/backend/jstree-mixin': true
                    },
                    'jquery': {
                        'jquery/patches/jquery': true
                    }
                },
                text: {
                    'headers': {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }
            }
        };

        require(['jquery'], function($) {
            'use strict';

            $.noConflict();
        });

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    'rowBuilder': 'Magento_Theme/js/row-builder',
                    'toggleAdvanced': 'mage/toggle',
                    'translateInline': 'mage/translate-inline',
                    'sticky': 'mage/sticky',
                    'tabs': 'mage/tabs',
                    'zoom': 'mage/zoom',
                    'collapsible': 'mage/collapsible',
                    'dropdownDialog': 'mage/dropdown',
                    'dropdown': 'mage/dropdowns',
                    'accordion': 'mage/accordion',
                    'loader': 'mage/loader',
                    'tooltip': 'mage/tooltip',
                    'deletableItem': 'mage/deletable-item',
                    'itemTable': 'mage/item-table',
                    'fieldsetControls': 'mage/fieldset-controls',
                    'fieldsetResetControl': 'mage/fieldset-controls',
                    'redirectUrl': 'mage/redirect-url',
                    'loaderAjax': 'mage/loader',
                    'menu': 'mage/menu',
                    'popupWindow': 'mage/popup-window',
                    'validation': 'mage/validation/validation',
                    'breadcrumbs': 'Magento_Theme/js/view/breadcrumbs',
                    'jquery/ui': 'jquery/compat',
                    'cookieStatus': 'Magento_Theme/js/cookie-status'
                }
            },
            deps: [
                'jquery/jquery.mobile.custom',
                'mage/common',
                'mage/dataPost',
                'mage/bootstrap'
            ],
            config: {
                mixins: {
                    'Magento_Theme/js/view/breadcrumbs': {
                        'Magento_Theme/js/view/add-home-breadcrumb': true
                    },
                    'jquery/ui-modules/dialog': {
                        'jquery/patches/jquery-ui': true
                    }
                }
            }
        };

        /* eslint-disable max-depth */
        /**
         * Adds polyfills only for browser contexts which prevents bundlers from including them.
         */
        if (typeof window !== 'undefined' && window.document) {
            /**
             * Polyfill localStorage and sessionStorage for browsers that do not support them.
             */
            try {
                if (!window.localStorage || !window.sessionStorage) {
                    throw new Error();
                }

                localStorage.setItem('storage_test', 1);
                localStorage.removeItem('storage_test');
            } catch (e) {
                config.deps.push('mage/polyfill');
            }
        }
        /* eslint-enable max-depth */

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    quickSearch: 'Magento_Search/js/form-mini',
                    'Magento_Search/form-mini': 'Magento_Search/js/form-mini'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    checkoutBalance: 'Magento_Customer/js/checkout-balance',
                    address: 'Magento_Customer/js/address',
                    changeEmailPassword: 'Magento_Customer/js/change-email-password',
                    passwordStrengthIndicator: 'Magento_Customer/js/password-strength-indicator',
                    zxcvbn: 'Magento_Customer/js/zxcvbn',
                    addressValidation: 'Magento_Customer/js/addressValidation',
                    'Magento_Customer/address': 'Magento_Customer/js/address',
                    'Magento_Customer/change-email-password': 'Magento_Customer/js/change-email-password'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    escaper: 'Magento_Security/js/escaper'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    compareList: 'Magento_Catalog/js/list',
                    relatedProducts: 'Magento_Catalog/js/related-products',
                    upsellProducts: 'Magento_Catalog/js/upsell-products',
                    productListToolbarForm: 'Magento_Catalog/js/product/list/toolbar',
                    catalogGallery: 'Magento_Catalog/js/gallery',
                    catalogAddToCart: 'Magento_Catalog/js/catalog-add-to-cart'
                }
            },
            config: {
                mixins: {
                    'Magento_Theme/js/view/breadcrumbs': {
                        'Magento_Catalog/js/product/breadcrumbs': true
                    }
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    priceBox: 'Magento_Catalog/js/price-box',
                    priceOptionDate: 'Magento_Catalog/js/price-option-date',
                    priceOptionFile: 'Magento_Catalog/js/price-option-file',
                    priceOptions: 'Magento_Catalog/js/price-options',
                    priceUtils: 'Magento_Catalog/js/price-utils'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    creditCardType: 'Magento_Payment/js/cc-type',
                    'Magento_Payment/cc-type': 'Magento_Payment/js/cc-type'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    addToCart: 'Magento_Msrp/js/msrp'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    giftMessage: 'Magento_Sales/js/gift-message',
                    ordersReturns: 'Magento_Sales/js/orders-returns',
                    'Magento_Sales/gift-message': 'Magento_Sales/js/gift-message',
                    'Magento_Sales/orders-returns': 'Magento_Sales/js/orders-returns'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    discountCode: 'Magento_Checkout/js/discount-codes',
                    shoppingCart: 'Magento_Checkout/js/shopping-cart',
                    regionUpdater: 'Magento_Checkout/js/region-updater',
                    sidebar: 'Magento_Checkout/js/sidebar',
                    checkoutLoader: 'Magento_Checkout/js/checkout-loader',
                    checkoutData: 'Magento_Checkout/js/checkout-data',
                    proceedToCheckout: 'Magento_Checkout/js/proceed-to-checkout',
                    catalogAddToCart: 'Magento_Catalog/js/catalog-add-to-cart'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    requireCookie: 'Magento_Cookie/js/require-cookie',
                    cookieNotices: 'Magento_Cookie/js/notices'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            paths: {
                'jquery/jquery-storageapi': 'Magento_Cookie/js/jquery.storageapi.extended'
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    bundleOption: 'Magento_Bundle/bundle',
                    priceBundle: 'Magento_Bundle/js/price-bundle',
                    slide: 'Magento_Bundle/js/slide',
                    productSummary: 'Magento_Bundle/js/product-summary'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    downloadable: 'Magento_Downloadable/js/downloadable',
                    'Magento_Downloadable/downloadable': 'Magento_Downloadable/js/downloadable'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    captcha: 'Magento_Captcha/js/captcha',
                    'Magento_Captcha/captcha': 'Magento_Captcha/js/captcha'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    catalogSearch: 'Magento_CatalogSearch/form-mini'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    giftOptions: 'Magento_GiftMessage/js/gift-options',
                    extraOptions: 'Magento_GiftMessage/js/extra-options',
                    'Magento_GiftMessage/gift-options': 'Magento_GiftMessage/js/gift-options',
                    'Magento_GiftMessage/extra-options': 'Magento_GiftMessage/js/extra-options'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            deps: [],
            shim: {
                'chartjs/Chart.min': ['moment'],
                'tiny_mce_4/tinymce.min': {
                    exports: 'tinyMCE'
                }
            },
            paths: {
                'ui/template': 'Magento_Ui/templates'
            },
            map: {
                '*': {
                    uiElement: 'Magento_Ui/js/lib/core/element/element',
                    uiCollection: 'Magento_Ui/js/lib/core/collection',
                    uiComponent: 'Magento_Ui/js/lib/core/collection',
                    uiClass: 'Magento_Ui/js/lib/core/class',
                    uiEvents: 'Magento_Ui/js/lib/core/events',
                    uiRegistry: 'Magento_Ui/js/lib/registry/registry',
                    consoleLogger: 'Magento_Ui/js/lib/logger/console-logger',
                    uiLayout: 'Magento_Ui/js/core/renderer/layout',
                    buttonAdapter: 'Magento_Ui/js/form/button-adapter',
                    chartJs: 'chartjs/Chart.min',
                    tinymce4: 'tiny_mce_4/tinymce.min',
                    wysiwygAdapter: 'mage/adminhtml/wysiwyg/tiny_mce/tinymce4Adapter'
                }
            }
        };

        /**
         * Adds polyfills only for browser contexts which prevents bundlers from including them.
         */
        if (typeof window !== 'undefined' && window.document) {
            /**
             * Polyfill Map and WeakMap for older browsers that do not support them.
             */
            if (typeof Map === 'undefined' || typeof WeakMap === 'undefined') {
                config.deps.push('es6-collections');
            }

            /**
             * Polyfill MutationObserver only for the browsers that do not support it.
             */
            if (typeof MutationObserver === 'undefined') {
                config.deps.push('MutationObserver');
            }

            /**
             * Polyfill FormData object for old browsers that don't have full support for it.
             */
            if (typeof FormData === 'undefined' || typeof FormData.prototype.get === 'undefined') {
                config.deps.push('FormData');
            }
        }

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    pageCache: 'Magento_PageCache/js/page-cache'
                }
            },
            deps: ['Magento_PageCache/js/form-key-provider']
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    configurable: 'Magento_ConfigurableProduct/js/configurable'
                }
            },
            config: {
                mixins: {
                    'Magento_Catalog/js/catalog-add-to-cart': {
                        'Magento_ConfigurableProduct/js/catalog-add-to-cart-mixin': true
                    }
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    configurableVariationQty: 'Magento_InventoryConfigurableProductFrontendUi/js/configurable-variation-qty'
                }
            },
            config: {
                mixins: {
                    'Magento_ConfigurableProduct/js/configurable': {
                        'Magento_InventoryConfigurableProductFrontendUi/js/configurable': true
                    }
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    multiShipping: 'Magento_Multishipping/js/multi-shipping',
                    orderOverview: 'Magento_Multishipping/js/overview',
                    payment: 'Magento_Multishipping/js/payment',
                    billingLoader: 'Magento_Checkout/js/checkout-loader',
                    cartUpdate: 'Magento_Checkout/js/action/update-shopping-cart'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    recentlyViewedProducts: 'Magento_Reports/js/recently-viewed'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        var config = {
            config: {
                mixins: {
                    'Magento_Checkout/js/model/quote': {
                        'Magento_InventoryInStorePickupFrontend/js/model/quote-ext': true
                    },
                    'Magento_Checkout/js/view/shipping-information': {
                        'Magento_InventoryInStorePickupFrontend/js/view/shipping-information-ext': true
                    }
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            config: {
                mixins: {
                    'Magento_Swatches/js/swatch-renderer': {
                        'Magento_InventorySwatchesFrontendUi/js/swatch-renderer': true
                    }
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    subscriptionStatusResolver: 'Magento_Newsletter/js/subscription-status-resolver',
                    newsletterSignUp: 'Magento_Newsletter/js/newsletter-sign-up'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            config: {
                mixins: {
                    'Magento_Checkout/js/action/select-payment-method': {
                        'Magento_SalesRule/js/action/select-payment-method-mixin': true
                    },
                    'Magento_Checkout/js/model/shipping-save-processor': {
                        'Magento_SalesRule/js/model/shipping-save-processor-mixin': true
                    },
                    'Magento_Checkout/js/action/place-order': {
                        'Magento_SalesRule/js/model/place-order-mixin': true
                    }
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            shim: {
                cardinaljs: {
                    exports: 'Cardinal'
                },
                cardinaljsSandbox: {
                    exports: 'Cardinal'
                }
            },
            paths: {
                cardinaljsSandbox: 'https://includestest.ccdc02.com/cardinalcruise/v1/songbird',
                cardinaljs: 'https://songbird.cardinalcommerce.com/edge/v1/songbird'
            }
        };


        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    transparent: 'Magento_Payment/js/transparent',
                    'Magento_Payment/transparent': 'Magento_Payment/js/transparent'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    orderReview: 'Magento_Paypal/js/order-review',
                    'Magento_Paypal/order-review': 'Magento_Paypal/js/order-review',
                    paypalCheckout: 'Magento_Paypal/js/paypal-checkout'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            config: {
                mixins: {
                    'Magento_Customer/js/customer-data': {
                        'Magento_Persistent/js/view/customer-data-mixin': true
                    }
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    loadPlayer: 'Magento_ProductVideo/js/load-player',
                    fotoramaVideoEvents: 'Magento_ProductVideo/js/fotorama-add-video-events'
                }
            },
            shim: {
                vimeoAPI: {}
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            config: {
                mixins: {
                    'Magento_Checkout/js/action/place-order': {
                        'Magento_CheckoutAgreements/js/model/place-order-mixin': true
                    },
                    'Magento_Checkout/js/action/set-payment-information': {
                        'Magento_CheckoutAgreements/js/model/set-payment-information-mixin': true
                    }
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        /*eslint strict: ["error", "global"]*/

        'use strict';

        var config = {
            config: {
                mixins: {
                    'Magento_Ui/js/view/messages': {
                        'Magento_ReCaptchaFrontendUi/js/ui-messages-mixin': true
                    }
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        // eslint-disable-next-line no-unused-vars
        var config = {
            config: {
                mixins: {
                    'Magento_Paypal/js/view/payment/method-renderer/payflowpro-method': {
                        'Magento_ReCaptchaPaypal/js/payflowpro-method-mixin': true
                    }
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            shim: {
                'Magento_Tinymce3/tiny_mce/tiny_mce_src': {
                    'exports': 'tinymce'
                }
            },
            map: {
                '*': {
                    'tinymceDeprecated': 'Magento_Tinymce3/tiny_mce/tiny_mce_src'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    editTrigger: 'mage/edit-trigger',
                    addClass: 'Magento_Translation/js/add-class',
                    'Magento_Translation/add-class': 'Magento_Translation/js/add-class'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    mageTranslationDictionary: 'Magento_Translation/js/mage-translation-dictionary'
                }
            },
            deps: [
                'mageTranslationDictionary'
            ]
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            config: {
                mixins: {
                    'Magento_Checkout/js/view/payment/list': {
                        'Magento_PaypalCaptcha/js/view/payment/list-mixin': true
                    }
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    'taxToggle': 'Magento_Weee/js/tax-toggle',
                    'Magento_Weee/tax-toggle': 'Magento_Weee/js/tax-toggle'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    wishlist: 'Magento_Wishlist/js/wishlist',
                    addToWishlist: 'Magento_Wishlist/js/add-to-wishlist',
                    wishlistSearch: 'Magento_Wishlist/js/search'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        var config = {
            config: {
                mixins: {
                    'Magento_Checkout/js/model/resource-url-manager': {
                        'Amasty_Extrafee/js/model/resource-url-manager-mixin': true
                    },
                    'Magento_Checkout/js/view/shipping': {
                        'Amasty_Extrafee/js/view/shipping-mixin': true
                    },
                    'Magento_Checkout/js/view/payment/default': {
                        'Amasty_Extrafee/js/view/payment/default-mixin': true
                    }
                }
            }
        };

        require.config(config);
    })();
    (function() {
        var config = {
            paths: {
                'mustache': 'AuthorizeNet_Core/js/lib/mustache.min'
            }
        };

        require.config(config);
    })();
    (function() {
        var config = {
            paths: {
                paypalCheckoutJs: 'https://www.paypalobjects.com/api/checkout',
                aecOrderReview: 'AuthorizeNet_PayPalExpress/js/order-review'
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © 2013-2017 Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    visaSdkSandBox: 'https://sandbox-assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js',
                    visaSdkProduction: 'https://assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js',
                    vcOrderReview: 'AuthorizeNet_VisaCheckout/js/order-review',
                    vcReviewButton: 'AuthorizeNet_VisaCheckout/js/order-review/vc-button'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * ClassyLlama_AvaTax
         *
         * NOTICE OF LICENSE
         *
         * This source file is subject to the Open Software License (OSL 3.0)
         * that is bundled with this package in the file LICENSE.txt.
         * It is also available through the world-wide-web at this URL:
         * http://opensource.org/licenses/osl-3.0.php
         *
         * @copyright  Copyright (c) 2016 Avalara, Inc.
         * @license    http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
         */

        var config = {
            map: {
                '*': {
                    "Magento_Checkout/js/model/shipping-save-processor/gift-registry": 'ClassyLlama_AvaTax/js/model/shipping-save-processor/gift-registry',
                    "Magento_Tax/template/checkout/cart/totals/tax": 'ClassyLlama_AvaTax/template/checkout/cart/totals/tax',
                    "Magento_Checkout/template/payment-methods/list": 'ClassyLlama_AvaTax/template/payment-methods/list',
                    "Magento_Tax/template/checkout/summary/tax": 'ClassyLlama_AvaTax/template/checkout/summary/tax',
                    multiShippingAddressValidation: 'ClassyLlama_AvaTax/js/multishipping-address-validation',
                    // Add the following alias to provide compatibility with Magento 2.2
                    addressValidation: 'ClassyLlama_AvaTax/js/addressValidation',
                    deleteCertificate: 'ClassyLlama_AvaTax/js/delete-certificate',
                    addressValidationModal: 'ClassyLlama_AvaTax/js/view/checkout-billing-address-validation-modal'
                }
            },
            config: {
                mixins: {
                    'Magento_Checkout/js/view/payment/list': {
                        'ClassyLlama_AvaTax/js/view/payment/list/certificates-link': true
                    },
                    'Magento_Tax/js/view/checkout/summary/tax': {
                        'ClassyLlama_AvaTax/js/view/checkout/summary/tax/mixin': true,
                        'ClassyLlama_AvaTax/js/view/payment/list/certificates-link': true
                    },
                    'Magento_Tax/js/view/checkout/cart/totals/tax': {
                        'ClassyLlama_AvaTax/js/view/checkout/summary/tax/mixin': true
                    },
                    'Magento_Checkout/js/view/estimation': {
                        // We can leverage the same login from the tax summary to determine if we have customs
                        'ClassyLlama_AvaTax/js/view/checkout/summary/tax/mixin': true,
                        'ClassyLlama_AvaTax/js/view/estimation/mixin': true
                    },
                    'Magento_Checkout/js/model/step-navigator': {
                        'ClassyLlama_AvaTax/js/model/step-navigator/mixin': true
                    },
                    'ClassyLlama_AvaTax/js/action/account-add-exemption': {
                        'ClassyLlama_AvaTax/js/customer-account-add-exemption': true
                    },
                    'Magento_Checkout/js/model/shipping-save-processor/default': {
                        'ClassyLlama_AvaTax/js/model/shipping-save-processor/default': true
                    }
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * ClassyLlama_AvaTax
         *
         * NOTICE OF LICENSE
         *
         * This source file is subject to the Open Software License (OSL 3.0)
         * that is bundled with this package in the file LICENSE.txt.
         * It is also available through the world-wide-web at this URL:
         * http://opensource.org/licenses/osl-3.0.php
         *
         * @copyright  Copyright (c) 2016 Avalara, Inc.
         * @license    http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
         */
        var config = {
            map: {
                '*': {
                    addressValidationModal: 'ClassyLlama_AvaTax/js/view/address-validation-modal'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Mageplaza
         *
         * NOTICE OF LICENSE
         *
         * This source file is subject to the mageplaza.com license that is
         * available through the world-wide-web at this URL:
         * https://www.mageplaza.com/LICENSE.txt
         *
         * DISCLAIMER
         *
         * Do not edit or add to this file if you wish to upgrade this extension to newer
         * version in the future.
         *
         * @category    Mageplaza
         * @package     Mageplaza_Core
         * @copyright   Copyright (c) Mageplaza (https://www.mageplaza.com/)
         * @license     https://www.mageplaza.com/LICENSE.txt
         */

        var config = {
            paths: {
                'mageplaza/core/jquery/popup': 'Mageplaza_Core/js/jquery.magnific-popup.min',
                'mageplaza/core/owl.carousel': 'Mageplaza_Core/js/owl.carousel.min',
                'mageplaza/core/bootstrap': 'Mageplaza_Core/js/bootstrap.min',
                mpIonRangeSlider: 'Mageplaza_Core/js/ion.rangeSlider.min',
                touchPunch: 'Mageplaza_Core/js/jquery.ui.touch-punch.min',
                mpDevbridgeAutocomplete: 'Mageplaza_Core/js/jquery.autocomplete.min'
            },
            shim: {
                "mageplaza/core/jquery/popup": ["jquery"],
                "mageplaza/core/owl.carousel": ["jquery"],
                "mageplaza/core/bootstrap": ["jquery"],
                mpIonRangeSlider: ["jquery"],
                mpDevbridgeAutocomplete: ["jquery"],
                touchPunch: ['jquery', 'jquery/ui']
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Mageplaza
         *
         * NOTICE OF LICENSE
         *
         * This source file is subject to the Mageplaza.com license that is
         * available through the world-wide-web at this URL:
         * https://www.mageplaza.com/LICENSE.txt
         *
         * DISCLAIMER
         *
         * Do not edit or add to this file if you wish to upgrade this extension to newer
         * version in the future.
         *
         * @category    Mageplaza
         * @package     Mageplaza_Blog
         * @copyright   Copyright (c) Mageplaza (https://www.mageplaza.com/)
         * @license     https://www.mageplaza.com/LICENSE.txt
         */

        var config = {
            paths: {
                comment: 'Mageplaza_Blog/js/comment',
                categoryTree: 'Mageplaza_Blog/js/categorytree',
                owlCarousel: 'Mageplaza_Core/js/owl.carousel.min'
            }
        };
        require.config(config);
    })();
    (function() {
        var config = {
            paths: {
                designtool: 'Commercepundit_CanvasPrintTool/js/designtool-canvasprints',
                designtoolCustom: 'Commercepundit_CanvasPrintTool/js/designtool-canvasprints-custom',
                canvasFabric: 'Commercepundit_CanvasPrintTool/js/fabric',
                popupOverlay: 'Commercepundit_CanvasPrintTool/js/jquery.popupoverlay',
                owlCarousel: 'Commercepundit_CanvasPrintTool/js/owl.carousel.min',
                jqueryUploadfile: 'Commercepundit_CanvasPrintTool/js/jquery.uploadfile',
                mCustomScrollbar: 'Commercepundit_CanvasPrintTool/js/jquery.mCustomScrollbar.concat.min',
                mCustomScrollbarCustom: 'Commercepundit_CanvasPrintTool/js/jquery.mCustomScrollbar.custom',
                jqueryMousewheel: 'Commercepundit_CanvasPrintTool/js/jquery.mousewheel.min',
                jqueryForm: 'Commercepundit_CanvasPrintTool/js/jquery.form',
                socialPopup: 'Commercepundit_CanvasPrintTool/js/social-popup',
                tipso: 'Commercepundit_CanvasPrintTool/js/tipso.min',
                jqueryui: 'Commercepundit_CanvasPrintTool/js/jquery-ui',
                jpicker: 'Commercepundit_CanvasPrintTool/js/jpicker',
                designtoolFotolia: 'Commercepundit_CanvasPrintTool/js/fotolia',
                html2canvas: 'Commercepundit_CanvasPrintTool/js/html2canvas',
                fontfaceobserver: 'Commercepundit_CanvasPrintTool/js/fontfaceobserver',
                opentype: 'Commercepundit_CanvasPrintTool/js/opentype',
                busrollfabric: 'Commercepundit_CanvasPrintTool/js/busroll-fabric',
                busrolltool: 'Commercepundit_CanvasPrintTool/js/designtool-busroll',
                mixitup: 'Commercepundit_CanvasPrintTool/js/jquery.mixitup.min',
                blocksit: 'Commercepundit_CanvasPrintTool/js/blocksit.min',
                touchPunch: 'Commercepundit_CanvasPrintTool/js/touchPunch',
                spectrum: 'Commercepundit_CanvasPrintTool/js/spectrum',
                wordcloud2: 'Commercepundit_CanvasPrintTool/js/wordcloud2',
                wordarttool: 'Commercepundit_CanvasPrintTool/js/designtool-wordart',
                canvasCurvedText: 'Commercepundit_CanvasPrintTool/js/canvas.fabric.CurvedText'
            },
            shim: {
                'jqueryUploadfile': {
                    deps: ['jquery']
                },
                'owlCarousel': {
                    deps: ['jquery']
                },
                'popupOverlay': {
                    deps: ['jquery']
                },
                'jqueryUploadfile': {
                    deps: ['jqueryForm']
                },
                'jpicker': {
                    deps: ['jquery']
                },
                'designtoolCustom': {
                    deps: ['jquery']
                },
                'jqueryui': {
                    deps: ['jquery']
                },
                'tipso': {
                    deps: ['jquery']
                },
                'mixitup': {
                    deps: ['jquery']
                },
                'blocksit': {
                    deps: ['jquery']
                },
                'touchPunch': {
                    deps: ['jquery', 'jqueryui']
                },
                'canvasCurvedText': {
                    deps: ['canvasFabric']
                },
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            map: {
                '*': {
                    ajaxGiftCardInfo: 'MageWorx_GiftCards/js/ajax-giftcard-info',
                    remainingGiftCardInfo: 'MageWorx_GiftCards/js/remaining-giftcard-info'
                }
            }
        };

        require.config(config);
    })();
    (function() {
        var config = {
            map: {
                '*': {
                    popup_verification: 'IDme_GroupVerification/js/view/popup_verification',
                    remove_verification: 'IDme_GroupVerification/js/view/remove_verification',
                }
            }
        };

        require.config(config);
    })();
    (function() {
        var config = {
            map: {
                '*': {
                    KlaviyoCustomerData: 'Klaviyo_Reclaim/js/customer',
                }
            },
            config: {
                mixins: {
                    'Magento_Checkout/js/model/shipping-save-processor/payload-extender': {
                        'Klaviyo_Reclaim/js/mixin/shipping-payload-extender-mixin': true
                    },
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Ebizmarts_MailChimp Magento JS component
         *
         * @category    Ebizmarts
         * @package     Ebizmarts_MailChimp
         * @author      Ebizmarts Team <info@ebizmarts.com>
         * @copyright   Ebizmarts (http://ebizmarts.com)
         * @license     http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
         */

        var config = {
            "map": {
                "*": {
                    campaigncatcher: 'Ebizmarts_MailChimp/js/campaigncatcher'
                }
            }
        };
        require.config(config);
    })();
    (function() {
        var config = {
            paths: {
                "intlTelInputs": 'MaxMage_InternationalTelephoneInput/js/intlTelInputs',
                "intlTelInputUtils": 'MaxMage_InternationalTelephoneInput/js/utils',
                "internationalTelephoneInput": 'MaxMage_InternationalTelephoneInput/js/internationalTelephoneInput'
            },

            shim: {
                'intlTelInputs': {
                    'deps': ['jquery', 'knockout']
                },
                'internationalTelephoneInput': {
                    'deps': ['jquery', 'intlTelInputs']
                }
            }
        };
        require.config(config);
    })();
    (function() {
        var config = {
            paths: {
                photomugTool: 'Commercepundit_PhotogiftTool/js/photomug-tool',
                pillowTool: 'Commercepundit_PhotogiftTool/js/pillow-tool',
                photoblanketTool: 'Commercepundit_PhotogiftTool/js/photoblanket-tool',
                photocoasterTool: 'Commercepundit_PhotogiftTool/js/photocoaster-tool',
                pettagsTool: 'Commercepundit_PhotogiftTool/js/pettags-tool',
                photomagnetTool: 'Commercepundit_PhotogiftTool/js/photomagnet-tool',
                calendarTool: 'Commercepundit_PhotogiftTool/js/calendar-tool',
                photobookTool: 'Commercepundit_PhotogiftTool/js/photobook-tool',
                posterTool: 'Commercepundit_PhotogiftTool/js/poster-tool',
                photoprintTool: 'Commercepundit_PhotogiftTool/js/photoprints-tool',
                photopuzzleTool: 'Commercepundit_PhotogiftTool/js/photopuzzle-tool',
                rubixcubeTool: 'Commercepundit_PhotogiftTool/js/rubixcube-tool',
                flipflopsTool: 'Commercepundit_PhotogiftTool/js/flipflops-tool',
                wallclockTool: 'Commercepundit_PhotogiftTool/js/wallclock-tool',
                walltilesTool: 'Commercepundit_PhotogiftTool/js/walltiles-tool',
                photoblockTool: 'Commercepundit_PhotogiftTool/js/photoblock-tool',
                ornamentsTool: 'Commercepundit_PhotogiftTool/js/ornaments-tool',
                umbrellaTool: 'Commercepundit_PhotogiftTool/js/umbrella-tool',
                playingcardsTool: 'Commercepundit_PhotogiftTool/js/playingcards-tool',
                choppingboardTool: 'Commercepundit_PhotogiftTool/js/choppingboard-tool',
                mousepadTool: 'Commercepundit_PhotogiftTool/js/mousepad-tool',
                tablematTool: 'Commercepundit_PhotogiftTool/js/tablemat-tool',
                bookmarksTool: 'Commercepundit_PhotogiftTool/js/bookmarks-tool',
                didacticgameTool: 'Commercepundit_PhotogiftTool/js/didacticgame-tool',
                doubleacrylicTool: 'Commercepundit_PhotogiftTool/js/doubleacrylic-tool',
                SocialPopup: 'Commercepundit_PhotogiftTool/js/social-popup',
                fotolia: 'Commercepundit_PhotogiftTool/js/fotolia',
                slick: 'Commercepundit_PhotogiftTool/js/slick.min',
                fabric: 'Commercepundit_PhotogiftTool/js/fabric',
                fabric36: 'Commercepundit_PhotogiftTool/js/fabric.3.6.1',
                fabric52: 'Commercepundit_PhotogiftTool/js/fabric.5.2',
                spectrum: 'Commercepundit_PhotogiftTool/js/spectrum',
                jqueryform: 'Commercepundit_PhotogiftTool/js/jquery.form',
                jqueryuploadfile: 'Commercepundit_PhotogiftTool/js/jquery.uploadfile',
                jquerynicescroll: 'Commercepundit_PhotogiftTool/js/jquery.nicescroll.min',
                jquerymalihuscrollbar: 'Commercepundit_PhotogiftTool/js/jquery.malihu.scrollbar',
                mCustomScrollbar: 'Commercepundit_PhotogiftTool/js/jquery.mCustomScrollbar.concat.min',
                owlCarousel: 'Commercepundit_PhotogiftTool/js/owl.carousel.min',
                popupoverlay: 'Commercepundit_PhotogiftTool/js/jquery.popupoverlay',
                fontfaceobserver: 'Commercepundit_PhotogiftTool/js/fontfaceobserver',
                tipso: 'Commercepundit_PhotogiftTool/js/tipso.min',
                lazyload: 'Commercepundit_PhotogiftTool/js/jquery.lazyload.min',
                html2canvas: 'Commercepundit_PhotogiftTool/js/html2canvas',
                scissor: 'Commercepundit_PhotogiftTool/js/scissor',
                turn: 'Commercepundit_PhotogiftTool/js/turn',
                touchPunch: 'Commercepundit_PhotogiftTool/js/touchPunch',
                jqueryui: 'Commercepundit_PhotogiftTool/js/jquery-ui',
                fabricCurvedText: 'Commercepundit_PhotogiftTool/js/fabric.curvedText',
                fabricCurvedText36: 'Commercepundit_PhotogiftTool/js/fabric.curvedText.3.6.1',
                fabricCurvedText52: 'Commercepundit_PhotogiftTool/js/fabric.curvedText.5.2',
                dobValidationRule: "Commercepundit_PhotogiftTool/js/dobValidationRule",
                apronsTool: 'Commercepundit_PhotogiftTool/js/aprons-tool',
                lightswitchpanelTool: 'Commercepundit_PhotogiftTool/js/lightswitchpanel-tool',
                frameTool: 'Commercepundit_PhotogiftTool/js/frame-tool', //New tool Frame JS
                neonchampTool: 'Commercepundit_PhotogiftTool/js/neonchamp-tool',
                dobValidationRule: "Commercepundit_PhotogiftTool/js/dobValidationRule"
            },
            shim: {
                'owlCarousel': {
                    deps: ['jquery']
                },
                'popupoverlay': {
                    deps: ['jquery']
                },
                'scissor': {
                    deps: ['jquery']
                },
                'touchPunch': {
                    deps: ['jquery', 'jqueryui']
                },
                'fabricCurvedText': {
                    deps: ['fabric']
                },
                'fabricCurvedText36': {
                    deps: ['fabric36']
                },
                'fabricCurvedText52': {
                    deps: ['fabric52']
                },
                'photocoasterTool': {
                    deps: ['jquery']
                },
                'pettagsTool': {
                    deps: ['jquery']
                },
                'bookmarksTool': {
                    deps: ['jquery']
                },
                'didacticgameTool': {
                    deps: ['jquery']
                },
                'calendarTool': {
                    deps: ['jquery']
                },
                'jqueryui': {
                    deps: ['jquery/ui']
                },
                'ornamentsTool': {
                    deps: ['jquery']
                },
                'frameTool': {
                    deps: ['jquery']
                },
                'neonchampTool': {
                    deps: ['jquery']
                },
                'wallclockTool': {
                    deps: ['jquery']
                },
                'walltilesTool': {
                    deps: ['jquery', 'jquery/ui']
                }
            }
        };

        require.config(config);
    })();
    (function() {
        /**
         * Mageplaza
         *
         * NOTICE OF LICENSE
         *
         * This source file is subject to the Mageplaza.com license that is
         * available through the world-wide-web at this URL:
         * https://www.mageplaza.com/LICENSE.txt
         *
         * DISCLAIMER
         *
         * Do not edit or add to this file if you wish to upgrade this extension to newer
         * version in the future.
         *
         * @category    Mageplaza
         * @package     Mageplaza_Smtp
         * @copyright   Copyright (c) Mageplaza (https://www.mageplaza.com/)
         * @license     https://www.mageplaza.com/LICENSE.txt
         */
        var config = {};
        if (typeof window.AVADA_EM !== 'undefined') {
            config = {
                config: {
                    mixins: {
                        'Magento_Checkout/js/view/billing-address': {
                            'Mageplaza_Smtp/js/view/billing-address-mixins': true
                        },
                        'Magento_Checkout/js/view/shipping': {
                            'Mageplaza_Smtp/js/view/shipping-mixins': true
                        }
                    }
                }
            };
        }

        require.config(config);
    })();
    (function() {
        var config = {
            map: {
                '*': {
                    billingaddress: 'Commercepundit_OrderImport/js/getbilling-address',
                    jConfirmation: 'Commercepundit_OrderImport/js/jquery-confirm'
                }
            },
            config: {
                mixins: {
                    'Magento_Ui/js/lib/validation/validator': {
                        'Commercepundit_OrderImport/js/validation-mixin': true
                    }
                }
            }
        };
        require.config(config);
    })();
    (function() {
        var config = {
            config: {
                mixins: {
                    'Magento_Checkout/js/model/step-navigator': {
                        'PayPal_Braintree/js/model/step-navigator-mixin': true
                    },
                    'PayPal_Braintree/js/view/payment/method-renderer/cc-form': {
                        'PayPal_Braintree/js/reCaptcha/braintree-cc-method-mixin': true
                    }
                }
            },
            map: {
                '*': {
                    braintreeCheckoutPayPalAdapter: 'PayPal_Braintree/js/view/payment/adapter'
                }
            },
        };

        require.config(config);
    })();
    (function() {
        /**
         * Config to pull in all the relevant Braintree JS SDKs
         * @type {{paths: {braintreePayPalInContextCheckout: string, braintreePayPalCheckout: string, braintreeVenmo: string, braintreeHostedFields: string, braintreeDataCollector: string, braintreeThreeDSecure: string, braintreeGooglePay: string, braintreeApplePay: string, braintreeAch: string, braintreeLpm: string, googlePayLibrary: string}, map: {"*": {braintree: string}}}}
         */
        var config = {
            map: {
                '*': {
                    braintree: 'https://js.braintreegateway.com/web/3.67.0/js/client.min.js',
                }
            },

            paths: {
                "braintreePayPalCheckout": "https://js.braintreegateway.com/web/3.67.0/js/paypal-checkout.min",
                "braintreeHostedFields": "https://js.braintreegateway.com/web/3.67.0/js/hosted-fields.min",
                "braintreeDataCollector": "https://js.braintreegateway.com/web/3.67.0/js/data-collector.min",
                "braintreeThreeDSecure": "https://js.braintreegateway.com/web/3.67.0/js/three-d-secure.min",
                "braintreeApplePay": 'https://js.braintreegateway.com/web/3.67.0/js/apple-pay.min',
                "braintreeGooglePay": 'https://js.braintreegateway.com/web/3.67.0/js/google-payment.min',
                "braintreeVenmo": 'https://js.braintreegateway.com/web/3.67.0/js/venmo.min',
                "braintreeAch": "https://js.braintreegateway.com/web/3.67.0/js/us-bank-account.min",
                "braintreeLpm": "https://js.braintreegateway.com/web/3.67.0/js/local-payment.min",
                "googlePayLibrary": "https://pay.google.com/gp/p/js/pay",
                "braintreePayPalInContextCheckout": "https://www.paypalobjects.com/api/checkout"
            }
        };

        require.config(config);
    })();
    (function() {
        var config = {
            map: {
                '*': {
                    owl_carousel: 'WeltPixel_OwlCarouselSlider/js/owl.carousel',
                    owl_config: 'WeltPixel_OwlCarouselSlider/js/owl.config',
                    owlAjax: 'WeltPixel_OwlCarouselSlider/js/owlAjax'
                }
            },
            shim: {
                owl_carousel: {
                    deps: ['jquery']
                },
                owl_config: {
                    deps: ['jquery', 'owl_carousel']
                },
                owlAjax: {
                    deps: ['jquery', 'owl_carousel', 'owl_config']
                }
            }
        };
        require.config(config);
    })();
    (function() {
        /**
         * Copyright © Magento, Inc. All rights reserved.
         * See COPYING.txt for license details.
         */

        var config = {
            deps: [
                'Magento_Theme/js/theme'
            ]
        };

        require.config(config);
    })();



})(require);