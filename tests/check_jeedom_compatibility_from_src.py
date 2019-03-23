"""Check Jeedom compatibility
"""
import re
import sys
import os

AJAX_PATH = 'core/core/ajax/'
CLASS_PATH = 'core/core/class/'
NEXTDOM_CLASS_PATH = '../core/class/'
NEXTDOM_ENTITY_PATH = '../src/Model/Entity/'
TESTS_PATH = 'compatibility/'

def get_ajax_actions_from_file(ajax_file):
    """Get ajax actions from a single Jeedom file
    :param ajax_file: Path of the ajax file
    :type ajax_file:  str
    :return:          List of actions
    :rtype:           list
    """
    with open(AJAX_PATH + ajax_file, 'r') as file_content:
        content = file_content.read()
        return re.findall(r'action\'\) == \'(.*?)\'', content)

def get_class_methods_from_file(class_file):
    """Get class methods from a single Jeedom file
    :param ajax_file: Path of the class file
    :type ajax_file:  str
    :return:          List of methods
    :rtype:           list
    """
    with open(CLASS_PATH + class_file, 'r') as file_content:
        content = file_content.read()
        return re.findall(r' function (\w+)\(', content)

def get_class_methods():
    """Get all class methods from Jeedom
    :return: All class methods actions
    :rtype:  dict
    """
    result = {}
    for class_file in os.listdir(CLASS_PATH):
        if class_file not in ('.', '..'):
            class_methods = get_class_methods_from_file(class_file)
            if class_methods:
                result[class_file] = class_methods
    return result

def get_ajax_actions():
    """Get all ajax actions from Jeedom
    :return: All ajax actions
    :rtype:  dict
    """
    result = {}
    for ajax_file in os.listdir(AJAX_PATH):
        if ajax_file not in ('.', '..'):
            ajax_actions = get_ajax_actions_from_file(ajax_file)
            if ajax_actions:
                result[ajax_file] = ajax_actions
    return result

def check_ajax_file(file_to_check, actions_list):
    """Check actions from file
    :param file_to_check: Ajax file to check
    :param actions_list:  List of actions
    :type:                str
    :type:                list
    :return:              True if all actions are tested
    :rtype:               bool
    """
    result = True
    test_name = file_to_check.replace('.ajax.php', '').capitalize()
    if test_name == 'Jeedom':
        test_name = 'NextDom'
    # Ignore migration functionnality
    if test_name == 'Migrate':
        return True
    test_file = TESTS_PATH + 'Ajax' + test_name + 'Test.php'
    if os.path.isfile(test_file):
        with open(test_file, 'r') as test_file_content:
            test_content = test_file_content.read()
            test_content = test_content.lower()
            for action in actions_list:
                if test_content.find('test' + action.lower()) == -1:
                    print('In ' + test_name + ', test for action ' + action + ' not found.')
                    result = False
    else:
        print('File ' + test_file + ' not found.')
        result = False
    return result

def check_if_ajax_action_is_tested(actions_to_check):
    """Check if file has tests
    :param actions_to_check: List of all actions to test
    :type actions_to_check:  dict
    """
    result = True
    for file_to_check in actions_to_check.keys():
        if not check_ajax_file(file_to_check, actions_to_check[file_to_check]):
            result = False
    return result

def get_entity_content_if_exists(base_class_file_content):
    """Get content of the entity file
    :param base_class_file_content: Name of the entity file
    :type base_class_file_content:  str
    :return:                        Content of the entity file if exists
    :rtype:                         str
    """
    result = ''
    entity_regex = r'extends \\?NextDom\\Model\\Entity\\(\w+)'
    entity_file_re = re.findall(entity_regex, base_class_file_content)
    if entity_file_re:
        with open(NEXTDOM_ENTITY_PATH + entity_file_re[0] + '.php') as entity_content:
            result = entity_content.read()
    return result

def check_class_methods_file(file_to_check, methods_list):
    """Check class methods from file
    :param file_to_check: Ajax file to check
    :param actions_list:  List of actions
    :type:                str
    :type:                list
    :return:              True if all actions are tested
    :rtype:               bool
    """
    result = True
    if file_to_check == 'jeedom.class.php':
        file_to_check = 'nextDom.class.php'
    # Ignore migration functionnality
    if file_to_check == 'migrate.class.php':
        return True
    if os.path.isfile(NEXTDOM_CLASS_PATH + file_to_check):
        with open(NEXTDOM_CLASS_PATH + file_to_check, 'r') as class_file_content:
            test_content = class_file_content.read()
            test_content = test_content + get_entity_content_if_exists(test_content)
            test_content = test_content.lower()
            for method in methods_list:
                if test_content.find('function ' + method.lower()) == -1:
                    print('In ' + file_to_check + ', method ' + method + ' not found.')
                    result = False
    else:
        print('Class ' + file_to_check + ' not found.')
        result = False
    return result

def check_if_class_methods_exists(class_methods_to_check):
    """Check if methods exists
    :param class_methods_to_check: Methods to check
    :type class_methods_to_check:  dict
    """
    result = True
    for file_to_check in class_methods_to_check.keys():
        if not check_class_methods_file(file_to_check, class_methods_to_check[file_to_check]):
            result = False
    return result

def start_tests():
    """Test compatibility with jeedom
    :return: False if error found
    :rtype:  bool
    """
    error = False
    jeedom_ajax_actions = get_ajax_actions()
    if not check_if_ajax_action_is_tested(jeedom_ajax_actions):
        error = True

    jeedom_class_methods = get_class_methods()
    if not check_if_class_methods_exists(jeedom_class_methods):
        error = True

    return error

if __name__ == "__main__":
    #os.system('git clone https://github.com/jeedom/core')
    os.system('cd core && git checkout stable -f > /dev/null')
    if not start_tests():
        sys.exit(1)
