jwerty.key('ctrl+s', function (e) {
    e.preventDefault();
    $("#bt_savelog_admin").click();
});

 $("#bt_savelog_admin").on('click', function (event) {
    $.hideAlert();
    var config = $('#config').getValues('.configKey')[0];
    config.actionOnMessage = json_encode($('#div_actionOnMessage .actionOnMessage').getValues('.expressionAttr'));
    nextdom.config.save({
        configuration: config,
        error: function (error) {
            notify("Erreur", error.message, 'error');
        },
        success: function () {
            nextdom.config.load({
                configuration: $('#log_admin').getValues('.configKey')[0],
                plugin: 'core',
                error: function (error) {
                    notify("Erreur", error.message, 'error');
                },
                success: function (data) {
                    $('#log_admin').setValues(data, '.configKey');
                    modifyWithoutSave = false;
                    notify("Info", '{{Sauvegarde réussie}}', 'success');
                }
            });
        }
    });
});

$.showLoading();
nextdom.config.load({
    configuration: $('#log_admin').getValues('.configKey:not(.noSet)')[0],
    error: function (error) {
        notify("Erreur", error.message, 'error');
    },
    success: function (data) {
        $('#log_admin').setValues(data, '.configKey');
        loadAactionOnMessage();

        modifyWithoutSave = false;
    }
});



$('#div_pageContainer').delegate('.configKey', 'change', function () {
    modifyWithoutSave = true;
});

$('#div_pageContainer').delegate('.configKey[data-l1key="log::engine"]', 'change', function () {
 $('.logEngine').hide();
 $('.logEngine.'+$(this).value()).show();
});

$('#bt_addActionOnMessage').on('click',function(){
    addActionOnMessage();
});


function loadAactionOnMessage(){
    $('#div_actionOnMessage').empty();
    nextdom.config.load({
        configuration: 'actionOnMessage',
        error: function (error) {
            notify("Erreur", error.message, 'error');
        },
        success: function (data) {
            if(data == ''){
                return;
            }
            actionOptions = [];
            for (var i in data) {
                addActionOnMessage(data[i]);
            }
            nextdom.cmd.displayActionsOption({
                params : actionOptions,
                async : false,
                error: function (error) {
                  notify("Erreur", error.message, 'error');
              },
              success : function(data){
                for(var i in data){
                    $('#'+data[i].id).append(data[i].html.html);
                }
                taAutosize();
            }
        });
        }
    });
}

function addActionOnMessage(_action) {
    if (!isset(_action)) {
        _action = {};
    }
    if (!isset(_action.options)) {
        _action.options = {};
    }
    var div = '<div class="actionOnMessage">';
    div += '<div class="form-group ">';
    div += '<label class="col-sm-4 control-label">Action</label>';
    div += '<div class="col-sm-2">';
    div += '<input type="checkbox" class="expressionAttr" id="MessageActiv" data-l1key="options" data-l2key="enable" checked title="{{Décocher pour désactiver l\'action}}" />';
    div += '<label for="MessageActiv" class="control-label label-check">{{Activer}}</label>';
    div += '</div>';
    div += '<div class="col-sm-2">';
    div += '<input type="checkbox" class="expressionAttr" id="MessagePara" data-l1key="options" data-l2key="background" title="{{Cocher pour que la commande s\'éxecute en parrallele des autres actions}}" />';
    div += '<label for="MessagePara" class="control-label label-check">{{En parallèle}}</label>';
    div += '</div>';
    div += '<div class="col-sm-4">';
    div += '<div class="input-group">';
    div += '<span class="input-group-btn">';
    div += '<a class="btn btn-default bt_removeAction btn-sm"><i class="fas fa-minus-circle"></i></a>';
    div += '</span>';
    div += '<input class="expressionAttr form-control input-sm cmdAction" data-l1key="cmd" />';
    div += '<span class="input-group-btn">';
    div += '<a class="btn btn-default btn-sm listAction" title="{{Sélectionner un mot-clé}}"><i class="fas fa-tasks"></i></a>';
    div += '<a class="btn btn-default btn-sm listCmdAction"><i class="fas fa-list-alt"></i></a>';
    div += '</span>';
    div += '</div>';
    div += '</div>';
    var actionOption_id = uniqId();
    div += '<div class="col-sm-5 actionOptions" id="'+actionOption_id+'">';
    div += '</div>';
    div += '</div>';
    $('#div_actionOnMessage').append(div);
    $('#div_actionOnMessage .actionOnMessage:last').setValues(_action, '.expressionAttr');
    actionOptions.push({
        expression : init(_action.cmd, ''),
        options : _action.options,
        id : actionOption_id
    });
}

$("body").delegate('.bt_removeAction', 'click', function () {
    $(this).closest('.actionOnMessage').remove();
});

$('body').delegate('.cmdAction.expressionAttr[data-l1key=cmd]', 'focusout', function (event) {
    var expression = $(this).closest('.actionOnMessage').getValues('.expressionAttr');
    var el = $(this);
    nextdom.cmd.displayActionOption($(this).value(), init(expression[0].options), function (html) {
        el.closest('.actionOnMessage').find('.actionOptions').html(html);
        taAutosize();
    })
});

$('#bt_removeTimelineEvent').on('click',function(){
    nextdom.removeTimelineEvents({
        error: function (error) {
            notify("Erreur", error.message, 'error');
        },
        success: function (data) {
            notify("Info", '{{Evènement de la timeline supprimé avec succès}}', 'success');
        }
    });
});

$("body").delegate(".listAction", 'click', function () {
    var el = $(this).closest('.actionOnMessage').find('.expressionAttr[data-l1key=cmd]');
    nextdom.getSelectActionModal({}, function (result) {
      el.value(result.human);
      nextdom.cmd.displayActionOption(el.value(), '', function (html) {
        el.closest('.actionOnMessage').find('.actionOptions').html(html);
        taAutosize();
    });
  });
  });

  $("body").delegate(".listCmdAction", 'click', function () {
    var el = $(this).closest('.actionOnMessage').find('.expressionAttr[data-l1key=cmd]');
    nextdom.cmd.getSelectModal({cmd: {type: 'action'}}, function (result) {
        el.value(result.human);
        nextdom.cmd.displayActionOption(el.value(), '', function (html) {
            el.closest('.actionOnMessage').find('.actionOptions').html(html);
            taAutosize();
        });
    });
});
