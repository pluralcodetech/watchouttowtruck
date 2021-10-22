import React from 'react';
import {SafeAreaView, ScrollView, View, StyleSheet, Alert} from 'react-native';
import {
  Header,
  Left,
  Icon,
  Button,
  Body,
  Title,
  Right,
  Root,
  Accordion,
  Text,
} from 'native-base';

const HelpScreen = ({navigation}) => {
  const help = [
    {
      title: 'About Slashmart',
      content: `SlashMart is a dedicated general online and offline grocery stores in Abuja, with our offline stores located across Abuja FCT. We deliver to home and offices variety of products ranging from non-perishable food, frozen food, baby food, home items, beverages & drinks, and much more.

With our innovative digital idea, list of handpicked quality products, and a dedicated logistics and delivery service, beyond the usual hype we are set to bring about a revolutionary change in the E-commerce shopping experience of our customers.

Explore the wide-range of products available as we set to expand more, place your order and our ever ready standby delivery team will deliver to your doorstep within 60minutes to 2hours, it's a promise!.`,
    },
    {
      title: 'How to order on Slashmart',
      content: `
    ✔️ Search for an item you want to buy either by category or by using the search bar.

    ✔️ Click on the 'Buy Now' button to automatically add to shopping cart or click on 'View Cart' to check out.

    ✔️ Enter a convenient delivery address if not already set on your account.

    ✔️ Select your preferred payment method, choose to pay with; E-wallet, Pay securely with your bank card Or choose to pay cash on delivery.
    
    ✔️ Enter a coupon code for a discount if any, then click on confirm order.
    You will get a confirmation call from one of our shop representative team, for detailed specifications or custom instructions on your order.

    ✔️ Depending on your location, we will deliver your order right to your doorstep within 60 minutes to 2 hours, it's a promise.`,
    },
    {
      title: 'Delivery Information',
      content: `When shopping on Slashmart you don't have to worry about delays in delivery time, we are all about speedy delivery. Here is all you need to know about your grocery delivery to all locations within Abuja.

    ✔️ We charge delivery fee ranging from ₦500 to ₦3,000 (depending on size of order and delivery location).

    ✔️ All orders placed on our site before 4pm will be delivered within 60 minutes to 3 hours. All orders after 4pm will be delivered the next day.

    ✔️ We will deliver your orders to the address you provided at the same delivery rate whether home or office without extra charge, but extra charges may apply if delivery fails due to your absence or negligence.`,
    },
    {
      title: 'Return Policy',
      content: `If in the case that you are not satisfied with your order or that you changed your mind on your purchase, you have a time space of 24hours to return the item in the same condition as it was delivered to you in order to get a refund or exchange.`,
    },
    {
      title: 'Our Contact',
      content: `KUBWA ABUJA,
 Address: Suite 9/10, Virginia Pavilion Plaza, Kubwa FCDA, Abuja.

  Phone No: 08130083264
  Email: order@slashmart.ng
  
  WUSE II  ABUJA
  Address: Suite TF15, Olive Plaza, Opposite Banex Junction,
  WUSE II, Abuja
  Phone No: 07041978629
  Email: support@slashmart.ng
  
  Facebook Page
  https://facebook.com/slashmartNigeria`,
    },
    {
      title: 'How to Earn Reward Bonus',
      content: `
    ✔️ Refer your family and friends to Slashmart and earn 500 Naira per active referral.

    ✔️ Earn free bonus on order above 10,000 Naira.

    ✔️ Bonus available on Slashmart app only

    ✔️ You can transfer your reward bonus to main wallet and use it to purchase items on Slashmart`,
    },
  ];

  const RenderHeader = ({item, expanded}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 17}}>
          {item.title.toUpperCase()}
        </Text>
        {expanded ? (
          <Icon style={{fontSize: 18}} name="remove-circle" />
        ) : (
          <Icon style={{fontSize: 18}} name="add-circle" />
        )}
      </View>
    );
  };
  return (
    <Root>
      <SafeAreaView>
        <Header>
          <Left>
            <Button transparent onPress={navigation.goBack}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Help</Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView
          style={{paddingHorizontal: 20, paddingVertical: 20}}
          showsVerticalScrollIndicator={false}>
          <Accordion
            renderHeader={(item, expanded) => (
              <RenderHeader item={item} expanded={expanded} />
            )}
            dataArray={help}
          />
        </ScrollView>
      </SafeAreaView>
    </Root>
  );
};

export default HelpScreen;
