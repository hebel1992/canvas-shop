import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {UserDataModel} from './user-data.model';
import {BasketItemModel} from '../basket/basket-item.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userDataChanged = new Subject<UserDataModel>();
  private userData: UserDataModel;

  setUserData(data: UserDataModel) {
    this.userData = data;
    this.userDataChanged.next(this.userData);
  }

  getCurrentUser() {
    return this.userData;
  }

  // updateBasket(newBasket: BasketItemModel[]) {
  //   this.userData.basket = newBasket;
  //   this.userDataChanged.next(this.userData);
  // }

  getEnglandCounties(){
    return [
      'Bath and North East Somerset',
      'Bedfordshire',
      'Berkshire',
      'Bristol',
      'Buckinghamshire',
      'Cambridgeshire',
      'Cheshire',
      'Cornwall',
      'County Durham',
      'Cumbria',
      'Derbyshire',
      'Devon',
      'Dorset',
      'East Riding of Yorkshire',
      'East Sussex',
      'Essex',
      'Gloucestershire',
      'Greater London',
      'Greater Manchester',
      'Hampshire',
      'Herefordshire',
      'Hertfordshire',
      'Isle of Wight',
      'Isles of Scilly',
      'Kent',
      'Lancashire',
      'Leicestershire',
      'Lincolnshire',
      'Merseyside',
      'Norfolk',
      'North Somerset',
      'North Yorkshire',
      'Northamptonshire',
      'Northumberland',
      'Nottinghamshire',
      'Oxfordshire',
      'Rutland',
      'Shropshire',
      'Somerset',
      'South Gloucestershire',
      'South Yorkshire',
      'Staffordshire',
      'Suffolk',
      'Surrey',
      'Tyne & Wear',
      'Warwickshire',
      'West Midlands',
      'West Sussex',
      'West Yorkshire',
      'Wiltshire',
      'Worcestershire'
    ];
  }

  getScotlandCounties(){
    return [
      'Aberdeenshire',
      'Angus',
      'Argyll & Bute',
      'Ayrshire',
      'Banffshire',
      'Berwickshire',
      'Borders',
      'Caithness',
      'Clackmannanshire',
      'Dumfries & Galloway',
      'Dunbartonshire',
      'East Ayrshire',
      'East Dunbartonshire',
      'East Lothian',
      'East Renfrewshire',
      'Fife',
      'Highland',
      'Inverclyde',
      'Kincardineshire',
      'Lanarkshire',
      'Midlothian',
      'Moray',
      'North Ayrshire',
      'North Lanarkshire',
      'Orkney',
      'Perth & Kinross',
      'Renfrewshire',
      'Shetland',
      'South Ayrshire',
      'South Lanarkshire',
      'Stirlingshire',
      'West Dunbartonshire',
      'West Lothian',
      'Western Isles'
    ];
  }
  getWalesCounties(){
    return [
      'Blaenau Gwent',
      'Bridgend',
      'Caerphilly',
      'Cardiff',
      'Carmarthenshire',
      'Ceredigion',
      'Conwy',
      'Denbighshire',
      'Flintshire',
      'Gwynedd',
      'Isle of Anglesey',
      'Merthyr Tydfil',
      'Monmouthshire',
      'Neath Port Talbot.',
      'Newport.',
      'Pembrokeshire',
      'Powy',
      'Rhondda Cynon Taff',
      'Swansea',
      'Torfaen',
      'Vale of Glamorgan',
      'Wrexham'
    ];
  }

  getNorthernIrelandCounties(){
    return [
      'Antrim',
      'Armagh',
      'Down',
      'Fermanagh',
      'Londonderry',
      'Tyrone'
    ];
  }
}
