import typing


def unnest(dct: typing.Dict[str, typing.Any], key: str):
    """
    Function to revert the way Marshmallow sets dictionaries.
    When Marshmallow sets dictionaries, it assumes keys with a '.'
    are for paths.

    ::

       >>> d = {'ter': {' mi': {' nal': 'val'}}}
       >>> k, v = unnest(d, 'ter')
       >>> k
       'ter. mi. nal'
       >>> v
       'val'

    """
    if isinstance(dct[key], dict):
        new_dct = {}
        int_key = [*dct[key]][0]
        new_key = f'{key}.{int_key}'
        new_dct[new_key] = dct[key][int_key]
        return unnest(new_dct, new_key)
    else:
        return key, dct[key]
