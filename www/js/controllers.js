// import { LoadingController } from 'ionic-angular';
angular.module('app.controllers', ['base64', 'ngCordova', 'angular-growl'])

.controller('ingresoCtrl', ['$scope', '$stateParams', '$http', '$base64', '$state', '$ionicLoading', 'growl', '$cordovaInAppBrowser',

    function($scope, $stateParams, $http, $base64, $state, $ionicLoading, $growl) {

        $scope.login = function(usuario, contrasenia) {

            $ionicLoading.show({
                template: '<ion-spinner icon="spiral"></ion-spinner>  Verificando...',
                duration: 9000
            });

            $http.get(r.getApiUrl() + "zmb_usuarioSet?$filter=Us eq '" + usuario + "' and Co eq '" + contrasenia + "'")
                .success(function(data, status, headers, config) {
                    if (data.d.results.length === 0) {
                        $ionicLoading.hide();
                        $growl.error("Usuario no válido");
                    } else if (data.d.results[0].Us == 'OK') {
                        $ionicLoading.hide();
                        $state.go("menDeAplicaciones");
                    } else {
                        $ionicLoading.hide();
                        $growl.error("Usuario no válido");
                    }
                })
                .error(function(error) {
                    $ionicLoading.hide();
                    $growl.error("Error de conexión");
                });
        };
    }
])

.controller('menDeAplicacionesCtrl', ['$scope', '$stateParams', '$state', '$ionicNavBarDelegate', '$cordovaInAppBrowser',
    function($scope, $stateParams, $state, $ionicNavBarDelegate, $cordovaInAppBrowser) {

        $scope.irOrdenes = function() {
            $state.go("fullordenes");
        };

        $scope.irLogOut = function() {
            $state.go("ingreso");
        };

        $scope.irWeb = function() {
            document.addEventListener("deviceready", function() {
                $cordovaInAppBrowser.open('http://ngcordova.com', '_blank', options)
                    .then(function(event) {
                        // success
                    })
                    .catch(function(event) {
                        alert('error');
                    });


                $cordovaInAppBrowser.close();

            }, false);
        };

    }
])

.controller('RdenesDeProducciNCtrl', ['$scope', '$stateParams', '$cordovaBarcodeScanner', '$http', '$state',
        function($scope, $stateParams, $cordovaBarcodeScanner, $http, $state) {

            $scope.multiIngreso = function() {
                $state.go("fullordenes");
            };

            $scope.listoTodos = function() {
                $state.go("listarTodos");
            };

        }
    ])
    .controller('listarTodosCtrl', ['$scope', '$rootScope', '$stateParams', '$http', '$timeout', '$ionicLoading', 'growl', '$ionicListDelegate',
        function($scope, r, $stateParams, $http, $timeout, $ionicLoading, $growl, $ionicListDelegate) {

            $scope.todos = [];
            $scope.listartodos = function() {
                $http.get(r.getApiUrl() + 'zmb_notificacionSet?$format=json').then(function(resp) {
                    $scope.todos = resp.data.d.results;
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };

            $scope.clicker = function(posicion) {
                var mensj = '';
                if (posicion.Estado == 'E') {
                    mensj = 'La oden: ' +
                        posicion.Aufnr +
                        '. Se proceso con error: ' +
                        posicion.Mensaje;

                    sweetAlert("Error", mensj, "error");
                } else {
                    mensj = 'La oden: ' +
                        posicion.Aufnr +
                        '. Generó la notificación: ' +
                        posicion.Rueck +
                        ' y el contador:' +
                        posicion.Rmzhl;

                    sweetAlert("Generada", mensj, "success");
                }
            };


            $scope.eliminar = function(aufnr, vornr, aplfl, rueck, rmzhl) {

                var lv_url = r.getApiUrl() + "zmb_notificacionSet(Mandt=''," +
                    "Aufnr='" + aufnr +
                    "',Vornr='" + vornr +
                    "',Aplfl='" + aplfl +
                    "',Rueck='" + rueck +
                    "',Rmzhl='" + rmzhl + "')";

                $ionicLoading.show({
                    template: '<ion-spinner icon="spiral"></ion-spinner>  Eliminando...',
                    duration: 8000
                });

                $http.delete(lv_url, {
                        headers: {
                            "X-Requested-With": 'X'
                        }
                    })
                    .success(function(data) {
                        $ionicLoading.hide();
                        $growl.success("<b>Notificación</b> eliminada");
                        $ionicListDelegate.closeOptionButtons();
                        $scope.listartodos();
                    })
                    .error(function(data, error, status, headers, config) {
                        $ionicLoading.hide();
                        $ionicListDelegate.closeOptionButtons();
                        $growl.error("Error de conoexión");
                    });
            };
            $scope.listartodos();

        }
    ])

.controller('fullordenesCtrl', ['$scope', '$rootScope', '$stateParams', '$cordovaBarcodeScanner', '$http', '$timeout', '$state', 'shareData', '$ionicLoading', 'growl', '$ionicListDelegate',

    function($scope, r, $stateParams, $cordovaBarcodeScanner, $http, $timeout, $state, shareData, $ionicLoading, $growl, $ionicListDelegate) {

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

        $scope.reenviar = function(aufnr, vornr, aplfl, icono, resultado, inx) {
            var usu = $scope.usuario;
            var ord = aufnr;
            var ope = vornr;
            var sec = aplfl;

            $ionicLoading.show({
                template: '<ion-spinner icon="spiral"></ion-spinner>  Notificando...',
                duration: 3000
            });

            return $http.post(r.getApiUrl() + 'zmb_notificacionSet', {
                    Aufnr: ord,
                    Vornr: ope,
                    Aplfl: sec,
                }, {
                    headers: {
                        "X-Requested-With": 'X'
                    }
                })
                .success(function(data) {
                    $ionicLoading.hide();
                    $scope.nuevos[inx].Resultado = "Enviada";
                    $scope.nuevos[inx].Icon = "icon ion-paper-airplane";
                    $growl.success("<b>Notificación</b> enviada");
                    $ionicListDelegate.closeOptionButtons();
                    return data;
                })
                .error(function(data, error, status, headers, config) {

                    $ionicLoading.hide();
                    icono = "icon ion-close-circled";
                    $growl.error("Error de conexión");
                    $ionicListDelegate.closeOptionButtons();
                    return data;
                });
        };

        $scope.agrego = function(codigo) {

            if (codigo !== null) {
                var usu = $scope.usuario;
                var ord = codigo.substring(0, 12);
                var ope = codigo.substring(12, 16);
                var sec = codigo.substring(16, 24);

                $ionicLoading.show({
                    template: '<ion-spinner icon="spiral"></ion-spinner>  Notificando...',
                    duration: 3000
                });

                return $http.post(r.getApiUrl() + 'zmb_notificacionSet', {
                        Aufnr: ord,
                        Vornr: ope,
                        Aplfl: sec
                    }, {
                        headers: {
                            "X-Requested-With": 'X',
                        }
                    })
                    .success(function(data) {
                        // $scope.refrescar();
                        $scope.nuevos.push({
                            Aufnr: ord,
                            Vornr: ope,
                            Aplfl: sec,
                            Icon: "icon ion-paper-airplane",
                            Resultado: "Enviada"
                        });
                        $ionicLoading.hide();
                        $growl.success("<b>Notificación</b> enviada");
                        return data;
                    })
                    .error(function(data, error, status, headers, config) {
                        $scope.nuevos.push({
                            Aufnr: ord,
                            Vornr: ope,
                            Aplfl: sec,
                            Icon: "icon ion-close-circled",
                            Resultado: "Error de conexión",
                        });
                        return data,
                            $growl.error("Error de conexión");

                    });
            }
        };

        $scope.tipeado = function() {
            var that = this;
            if (this.agregado !== null && this.agregado !== '') {
                $scope.agrego(this.agregado).then(function(data) {
                    that.agregado = '';
                });
            }
        };
    }
]);