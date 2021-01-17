var apiUrl = "https://localhost:44334/";
var pathname = window.location.pathname;

// functions
function getAccessToken() {
    var loginDataJson = sessionStorage["login"] || localStorage["login"];
    var loginData;
    try {
        loginData = JSON.parse(loginDataJson);
    } catch (error) {
        return null;
    }

    if (!loginData || !loginData.access_token) {
        return null;
    }

    return loginData.access_token;
}

function getAuthHeaders() {
    return { Authorization: "Bearer " + getAccessToken() };
}

function girisKontrol() {
    if (pathname == "/giris.html") return;

    var accessToken = getAccessToken();

    if (!accessToken) {
        window.location.href = "giris.html";
        return;
    }

    // token şu an elimizde ama geçerli mi?
    $.ajax({
        type: "get",
        headers: getAuthHeaders(),
        url: apiUrl + "api/Account/UserInfo",
        success: function (data) {
            $("#loginAd").text(data.Email);
            borclariListele();
            $(".gizle").removeClass("gizle");
        },
        error: function () {
            window.location.href = "giris.html";
        }
    });
}

function borclariListele() {
    $.ajax({
        type: "get",
        headers: getAuthHeaders(),
        url: apiUrl + "api/Borclar/Listele",
        success: function (data) {
            borclariTabloyaEkle(data);
        },
        error: function () {

        }
    });
}

function borclariTabloyaEkle(borclar) {
    for (var i = 0; i < borclar.length; i++) {
        borcuTabloyaEkle(borclar[i]);
    }
}

function borcuTabloyaEkle(borc) {
    var html =
        '<tr class="' + (borc.BorcluMuyum ? 'tarafAlacakli' : 'tarafBorclu') + '">' +
        '<td>' + borc.Taraf + '</td>' +
        '<td class="borcMiktarSutun">' + borc.BorcMiktar.toFixed(2) + '</td>' +
        '<td>' + tarihBicimlendir(borc.SonOdemeTarihi) + '</td>' +
        '<td>' + borcKapandiSwitch(borc.BorcKapandiMi, borc.Id) + '</td>' +
        '<td>' + borcSil(borc.Id) + '</td>' +
        '</tr>';
    $("#tblBorclar tbody").append(html);
}

function borcSil(borcSilmeId){
    return '<div class="custom-control">' +
        '<button type="submit" class="btn btn-danger" data-borc-sil-id="' + borcSilmeId + '">Sil</button>' +
        '</div>';
}

function borcKapandiSwitch(borcKapandiMi, borcId) {
    var elemId = "chkKapandi-" + borcId;
    return '<div class="custom-control custom-switch">' +
        '<input type="checkbox" class="custom-control-input" data-borc-switch-id="' + borcId + '" id="' + elemId + '"' + (borcKapandiMi ? " checked": "") + '>' +
        '<label class="custom-control-label" for="' + elemId + '"></label>' +
        '</div>';
}

// isoTarih: 2020-12-31T23:59:59
function tarihBicimlendir(isoTarih) {
    if (!isoTarih) {
        return "";
    }

    var tarih = new Date(isoTarih);
    return tarih.toLocaleDateString();
}

// events
$("#btnCikisYap").click(function (event) {
    event.preventDefault();
    localStorage.removeItem("login");
    sessionStorage.removeItem("login");
    window.location.href = "giris.html";
});

$("#btnKayitOl").click(function (event) {
    event.preventDefault();
    $(".gizle").removeClass("gizle");
    $("#frmGiris").addClass("gizle");
});

$("#frmGiris").submit(function (event) {
    var frmGiris = this;
    var hatirla = $("#rememberme").prop("checked"); // true | false
    event.preventDefault();

    $.ajax({
        type: "post",
        url: apiUrl + "Token",
        data: {
            grant_type: "password",
            username: $("#inputEmail").val(),
            password: $("#inputPassword").val()
        },
        success: function (data) {
            frmGiris.reset();
            localStorage.removeItem("login");
            sessionStorage.removeItem("login");
            var storage = hatirla ? localStorage : sessionStorage;
            storage["login"] = JSON.stringify(data);

            $("#basari").text("Giriş başarılı. Anasayfaya yönlendiriliyor..").show();
            setTimeout(function () {
                location.href = "/";
            }, 1000);
        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON.error == "invalid_grant") {
                $("#hata").text("Kullanıcı adı ya da parola yanlış!").show();
            }
        }
    });
});

$("#frmGiris").on("input", function () {
    $("#hata").hide();
});

$("#frmKayit").on("input", function () {
    $("#kayitHata").hide();
});



$(document).ajaxStart(function () {
    $("#loading").removeClass("d-none");
});

$(document).ajaxStop(function () {
    $("#loading").addClass("d-none");
});

$("#frmBorc").submit(function (event) {
    event.preventDefault();
    var frm = this;

    $.ajax({
        type: "post",
        url: apiUrl + "api/Borclar/Ekle",
        headers: getAuthHeaders(),
        data: $(frm).serialize(),
        success: function (data) {
            frm.reset();
            borcuTabloyaEkle(data);
        },
        error: function (xhr, status, error) {
            console.log("eklenirken hata");
        }
    });
});

$("body").on("click","[data-borc-sil-id]",function (event) {
    event.preventDefault();
    console.log("ok");
    var borcId = $(this).data("borc-sil-id");

    $.ajax({
        type: "Delete",
        headers: getAuthHeaders(),
        url: apiUrl + "api/Borclar/BorcSil?BorcId=" + borcId,
        data: {BorcId: borcId},
        success: function(data) {
            console.log("Silme Başarılı");
            $("#tblBorclar tbody").html("");
            borclariListele(data);
        },
        error: function(xhr,status,error) {
            console.log("Borç Silme Hata");
        }
    });
});

$("body").on("change", "[data-borc-switch-id]", function(event) {
    var borcId = $(this).data("borc-switch-id");
    var borcKapandiMi = $(this).prop("checked");
    
    $.ajax({
        type: "put",
        url: apiUrl + "api/Borclar/KapanmaDurumGuncelle/" + borcId,
        headers: getAuthHeaders(),
        data: { BorcId: borcId, BorcKapandiMi: borcKapandiMi },
        success: function (data) {

        },
        error: function (xhr, status, error) {
            console.log("borç kapama güncelle hata");
        }
    });
});

$("#frmKayit").submit(function (event) {
    var frmKayit = this;
    event.preventDefault();

    $.ajax({
        type: "post",
        url: apiUrl + "api/Account/Register",
        data: {
            Email: $("#inputEmailRegister").val(),
            Password: $("#inputPasswordRegister").val(),
            ConfirmPassword: $("#confirmPasswordRegister").val()
        },
        success: function (data) {
            frmKayit.reset();


            $("#kayitBasari").text("Kayıt başarılı. Anasayfaya yönlendiriliyor..").show();
            setTimeout(function () {
                location.href = "/";
            }, 2000);
        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON.error == "invalid_grant") {
                $("#kayitHata").text("Kullanıcı adı ya da parola yanlış!").show();
            }
        }
    });
});

girisKontrol();