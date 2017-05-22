// import { LoadingController } from 'ionic-angular';
angular.module('app.controllers', ['base64', 'ngCordova', 'angular-growl'])

.controller('ingresoCtrl', ['$scope', '$stateParams', '$http', '$base64', '$state', '$ionicLoading', 'growl', '$cordovaInAppBrowser',
    // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $http, $base64, $state, $ionicLoading, $growl) {

        $scope.login = function(usuario, contrasenia) {

        $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner>  Verificando...',
          duration: 9000
        });
  var deviceInformation      = ionic.Platform.device();
  var isWebView              = ionic.Platform.isWebView();
  var isIPad                 = ionic.Platform.isIPad();
  var isIOS                  = ionic.Platform.isIOS();
  var isAndroid              = ionic.Platform.isAndroid();
  var isWindowsPhone         = ionic.Platform.isWindowsPhone();
  var currentPlatform        = ionic.Platform.platform();
  var currentPlatformVersion = ionic.Platform.version();
  if (isIOS || isAndroid) {
            var lv_url = "http://181.15.198.242:9524/sap/opu/odata/sap/ZMB_ORDEN_SRV/zmb_usuarioSet?$filter=Us eq '" +
                usuario +
                "' and Co eq '" +
                contrasenia + "'";  
  } else{

            var lv_url = "/proxy/ZMB_ORDEN_SRV/zmb_usuarioSet?$filter=Us eq '" +
                usuario +
                "' and Co eq '" +
                contrasenia + "'";
   }
            // ACA VAN MIS LLAMADOS DESDE LOS BOTONES POR EJEMPLO Y LOGICA
            // var lv_url = "/proxy/ZMB_ORDEN_SRV/zmb_usuarioSet?$filter=Us eq '" +
            //     usuario +
            //     "' and Co eq '" +
            //     contrasenia + "'";
            // var lv_url = "http://181.15.198.242:9524/sap/opu/odata/sap/ZMB_ORDEN_SRV/zmb_usuarioSet?$filter=Us eq '" +
            //     usuario +
            //     "' and Co eq '" +
            //     contrasenia + "'";            

            $http.get(lv_url)
                .success(function(data, status, headers, config) {
                    // Valido que haya logueado OK
                    if( data.d.results.length == 0)
                         $ionicLoading.hide(),                 
                         $growl.error("Usuario no válido");   
                    else if( data.d.results[0].Us == 'OK')
                        // VOY A LA SIGUIENTE PANTALLA
                        $ionicLoading.hide(),
                        // $growl.success("<b>Notificación</b> registrada", config),
                        $state.go("menDeAplicaciones");
                    else
                        $ionicLoading.hide(),
                        $growl.error("Usuario no válido");   
                })
                .error(function(error) {
                     $ionicLoading.hide(),  
                     $growl.error("Error de conexión");   
                });
        }
    }
])

.controller('menDeAplicacionesCtrl', ['$scope', '$stateParams', '$state', '$ionicNavBarDelegate', '$cordovaInAppBrowser', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $state, $ionicNavBarDelegate,$cordovaInAppBrowser ) {

        $scope.irOrdenes = function() {
            $state.go("fullordenes");
            // $ionicNavBarDelegate.showBackButton(false);
        }

        $scope.irLogOut = function() {
            $state.go("ingreso");
        }

        $scope.irWeb = function() {
          document.addEventListener("deviceready", function () {
    $cordovaInAppBrowser.open('http://ngcordova.com', '_blank', options)
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        alert('error')
      });


    $cordovaInAppBrowser.close();

  }, false);
      }

    }
])

.controller('RdenesDeProducciNCtrl', ['$scope', '$stateParams', '$cordovaBarcodeScanner', '$http', '$state',
    // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $cordovaBarcodeScanner, $http, $state) {

        $scope.multiIngreso = function() {
            $state.go("fullordenes");
        }

        $scope.listoTodos = function() {
            $state.go("listarTodos");
        }

    }
])
.controller('listarTodosCtrl', ['$scope', '$stateParams', '$http', '$timeout','$ionicLoading', 'growl',
    // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $http, $timeout, $ionicLoading, $growl) {

        $scope.todos = [];
        $scope.listartodos = function() {
            var dir = '';
        var isIOS                  = ionic.Platform.isIOS();  
        var isAndroid              = ionic.Platform.isAndroid();  
  if (isIOS || isAndroid) {
            dir = "http://181.15.198.242:9524/sap/opu/odata/sap/ZMB_ORDEN_SRV/zmb_notificacionSet?$format=json";
  } else{

            dir = "/proxy/ZMB_ORDEN_SRV/zmb_notificacionSet?$format=json";
   }            
            $http.get(dir)
            // $http.get("/proxy/ZMB_ORDEN_SRV/zmb_notificacionSet")
                .success(function(datos) {
                    $scope.todos = datos;
                })
                .error(function(error) {
                    console.log(error);
                });
        }
        $scope.listartodos();

        $scope.clicker = function(posicion) {
            var mensj = '';
              if( posicion.Estado == 'E')   
               mensj = 'La oden: ' + 
                       posicion.Aufnr + 
                       '. Se proceso con error: ' +
                       posicion.Mensaje,

                  sweetAlert("Error", mensj, "error");
              else
                   mensj = 'La oden: ' + 
                       posicion.Aufnr + 
                       '. Generó la notificación: ' +
                       posicion.Rueck + 
                       ' y el contador:' +
                       posicion.Rmzhl ,

                  sweetAlert("Generada", mensj, "success");
        }

        $scope.refrescar = function() {
            $timeout(function() {
                $scope.listartodos();
                $scope.$broadcast("scroll.refreshComplete");
            }, 1000);
        }
      

        $scope.eliminar = function(aufnr,vornr,aplfl,rueck,rmzhl) {
        var lv_init = '';
        var isIOS                  = ionic.Platform.isIOS();  
        var isAndroid              = ionic.Platform.isAndroid();  
  if (isIOS || isAndroid) {
            lv_init = "http://181.15.198.242:9524/sap/opu/odata/sap/ZMB_ORDEN_SRV/zmb_notificacionSet(Mandt='',";
  } else{

            lv_init = "/proxy/ZMB_ORDEN_SRV/zmb_notificacionSet(Mandt='',";
   }                
            // var usu = $scope.usuario;
            // var ord = aufnr;
            // var ope = vornr;
            // var sec = aplfl;
            // var rue = ;
            // var rmx = 
            var lv_url = lv_init + 
                         "Aufnr='"  + aufnr + 
                         "',Vornr='" + vornr + 
                         "',Aplfl='" + aplfl +
                         "',Rueck='" + rueck +
                         "',Rmzhl='" + rmzhl + "')";

        $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner>  Eliminando...',
          // template: 'Verificando...',
          duration: 8000
        });            
            $http({
                    url: lv_url,
                    headers: {
                         "X-Requested-With" : 'X',
                    },                    
                    method: 'DELETE',
                        // data: {
                        //     Aufnr: ord,
                        //     Vornr: ope,
                        //     Aplfl: sec,
                        //     // Rueck: not,
                        //     // Rmzhl: con,
                        //     }                    
                })
                .success(function(data) {
                  $ionicLoading.hide(),    
                  $growl.success("<b>Notificación</b> eliminada"),   
                  $scope.refrescar();
                })
                .error(function(data, error, status, headers, config) {
                    $ionicLoading.hide(),
                    $growl.error("Error de conoexión");  
                });
        }

    }
])

.controller('fullordenesCtrl', ['$scope', '$stateParams', '$cordovaBarcodeScanner', '$http', '$timeout', '$state','shareData','$ionicLoading', 'growl', 
    // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $cordovaBarcodeScanner, $http, $timeout, $state,shareData, $ionicLoading, $growl, $cordovaKeyboard) {

        $scope.verIngresados = function() {
            $state.go("listarTodos");
            }
        var vm = this;
        $scope.nuevos = shareData.getData();
        $scope.scanCodigo = function() {
            document.addEventListener("deviceready", function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(barcodeData) {
                        if (barcodeData.text != null && barcodeData.text != '') {
                        $scope.agrego(barcodeData.text);
                    } 
                    }, function(error) {
                        // An error occurred
                    });
            }, false);
        }

        $scope.reenviar = function(aufnr,vornr,aplfl,icono) {
            var usu = $scope.usuario;
            var ord = aufnr;
            var ope = vornr;
            var sec = aplfl;
            // lv_url = "/proxy/ZMB_ORDEN_SRV/zmb_notificacionSet";
            var lv_init = '';
            var isIOS                  = ionic.Platform.isIOS();   
            var isAndroid              = ionic.Platform.isAndroid();  
            if (isIOS || isAndroid) {
                    lv_init = "http://181.15.198.242:9524/sap/opu/odata/sap/ZMB_ORDEN_SRV/zmb_notificacionSet";
            } else{
                    lv_init = "/proxy/ZMB_ORDEN_SRV/zmb_notificacionSet";
                   }               
            lv_url = lv_init;
        $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner>  Notificando...',
          // template: 'Verificando...',
          duration: 3000
        });

            return $http({
                url: lv_url,
                method: 'POST',
                        data: {
                            Aufnr: ord,
                            Vornr: ope,
                            Aplfl: sec,                   
                        },
                    headers: {
                         "X-Requested-With" : 'X',
                    },
                })
                .success(function(data) {       
                  $ionicLoading.hide(),    
                  icono = "icon ion-paper-airplane",
                  $growl.success("<b>Notificación</b> enviada"); 
                  $scope.refrescar();           
                  return data;
                })
                .error(function(data, error, status, headers, config) {
                  return data,
                  $ionicLoading.hide(),  
                  icono = "icon ion-close-circled",
                  $growl.error("Error de conexión");  

                });
        }        

        $scope.agrego = function(codigo) {

        if (codigo != null) {
            
            var usu = $scope.usuario;
            var ord = codigo.substring(0,  12);
            var ope = codigo.substring(12, 16);
            var sec = codigo.substring(16, 24);
            var lv_init = '';
            var isIOS                  = ionic.Platform.isIOS();   
            var isAndroid              = ionic.Platform.isAndroid();  
            if (isIOS || isAndroid) {
                    lv_init = "http://181.15.198.242:9524/sap/opu/odata/sap/ZMB_ORDEN_SRV/zmb_notificacionSet";
            } else{
                    lv_init = "/proxy/ZMB_ORDEN_SRV/zmb_notificacionSet";
                   }               
            lv_url = lv_init;

        $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner>  Notificando...',
          // template: 'Verificando...',
            duration: 3000
        });

            return $http({
                url: lv_url,
                method: 'POST',
                        data: {
                            Aufnr: ord,
                            Vornr: ope,
                            Aplfl: sec,
                         // Lmnga:
                         // Xmnga:
                         // Rmnga:
                         // Grund:
                         // Us:                        
                        },
                    headers: {
                         "X-Requested-With" : 'X',
                    },
                })
                .success(function(data) {
                    // $scope.refrescar();
                  $scope.nuevos.push({
                            Aufnr: ord,
                            Vornr: ope,
                            Aplfl: sec,
                            Icon:  "icon ion-paper-airplane",
                            Resultado:  "Enviado",
                  });        
                  $ionicLoading.hide(),    
                  $growl.success("<b>Notificación</b> enviada");            
                  return data;
                })
                .error(function(data, error, status, headers, config) {
                  $scope.nuevos.push({
                            Aufnr: ord,
                            Vornr: ope,
                            Aplfl: sec,
                            Icon:  "icon ion-close-circled",
                            Resultado:  "Error de conexión",
                  }); 
                  return data,
                  $growl.error("Error de conexión");  

                });
                    }                
        }

        $scope.tipeado = function() {
            var that = this;
            if (this.agregado != null && this.agregado != '') {
            $scope.agrego(this.agregado).then(function(data) {
                that.agregado = '';
            })
            }
        }   
  }
])