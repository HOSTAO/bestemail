<?php
/**
 * Plugin Name: Bestemail Connector
 * Description: Connect your WordPress site to Bestemail for all email sending
 * Version: 1.0.0
 * Author: Bestemail Platform
 * 
 * Just upload this file to wp-content/plugins/ and activate!
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Add settings page
add_action('admin_menu', 'bestemail_add_admin_menu');
function bestemail_add_admin_menu() {
    add_options_page(
        'Bestemail Settings',
        'Bestemail',
        'manage_options',
        'bestemail',
        'bestemail_settings_page'
    );
}

// Settings page HTML
function bestemail_settings_page() {
    ?>
    <div class="wrap">
        <h1>Bestemail Settings</h1>
        <form method="post" action="options.php">
            <?php settings_fields('bestemail_settings'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row">API Key</th>
                    <td>
                        <input type="text" name="bestemail_api_key" value="<?php echo esc_attr(get_option('bestemail_api_key')); ?>" class="regular-text" />
                        <p class="description">Get your API key from my.bestemail.in</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">List ID</th>
                    <td>
                        <input type="text" name="bestemail_list_id" value="<?php echo esc_attr(get_option('bestemail_list_id')); ?>" class="regular-text" />
                        <p class="description">Your default list ID for transactional emails</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">From Name</th>
                    <td>
                        <input type="text" name="bestemail_from_name" value="<?php echo esc_attr(get_option('bestemail_from_name', get_bloginfo('name'))); ?>" class="regular-text" />
                    </td>
                </tr>
                <tr>
                    <th scope="row">From Email</th>
                    <td>
                        <input type="email" name="bestemail_from_email" value="<?php echo esc_attr(get_option('bestemail_from_email', get_option('admin_email'))); ?>" class="regular-text" />
                    </td>
                </tr>
                <tr>
                    <th scope="row">Track Opens</th>
                    <td>
                        <label>
                            <input type="checkbox" name="bestemail_track_opens" value="1" <?php checked(get_option('bestemail_track_opens', 1)); ?> />
                            Enable email open tracking
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Track Clicks</th>
                    <td>
                        <label>
                            <input type="checkbox" name="bestemail_track_clicks" value="1" <?php checked(get_option('bestemail_track_clicks', 1)); ?> />
                            Enable link click tracking
                        </label>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save Settings'); ?>
        </form>
        
        <hr />
        
        <h2>Test Email</h2>
        <form method="post" action="">
            <?php wp_nonce_field('bestemail_test_email', 'bestemail_test_nonce'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row">Send Test Email To</th>
                    <td>
                        <input type="email" name="test_email" value="<?php echo esc_attr(get_option('admin_email')); ?>" class="regular-text" />
                        <input type="submit" name="bestemail_test" value="Send Test Email" class="button button-secondary" />
                    </td>
                </tr>
            </table>
        </form>
        
        <?php
        if (isset($_POST['bestemail_test']) && wp_verify_nonce($_POST['bestemail_test_nonce'], 'bestemail_test_email')) {
            $result = wp_mail(
                $_POST['test_email'],
                'Test Email from Bestemail',
                '<h1>Success!</h1><p>Your Bestemail integration is working perfectly.</p>'
            );
            
            if ($result) {
                echo '<div class="notice notice-success"><p>Test email sent successfully!</p></div>';
            } else {
                echo '<div class="notice notice-error"><p>Test email failed. Please check your settings.</p></div>';
            }
        }
        ?>
        
        <hr />
        
        <h2>Quick Stats</h2>
        <p>✅ Plugin Active</p>
        <p>📧 All WordPress emails will be sent through Bestemail</p>
        <p>💰 Cost: ₹0.10 per 1,000 emails</p>
    </div>
    <?php
}

// Register settings
add_action('admin_init', 'bestemail_register_settings');
function bestemail_register_settings() {
    register_setting('bestemail_settings', 'bestemail_api_key');
    register_setting('bestemail_settings', 'bestemail_list_id');
    register_setting('bestemail_settings', 'bestemail_from_name');
    register_setting('bestemail_settings', 'bestemail_from_email');
    register_setting('bestemail_settings', 'bestemail_track_opens');
    register_setting('bestemail_settings', 'bestemail_track_clicks');
}

// Override wp_mail function
if (!function_exists('wp_mail')) {
    function wp_mail($to, $subject, $message, $headers = '', $attachments = array()) {
        // Get settings
        $api_key = get_option('bestemail_api_key');
        $list_id = get_option('bestemail_list_id');
        
        if (empty($api_key)) {
            // Fallback to PHP mail if not configured
            return mail($to, $subject, $message, $headers);
        }
        
        // Prepare data
        $data = array(
            'api_key' => $api_key,
            'to' => $to,
            'subject' => $subject,
            'html' => $message,
            'from_name' => get_option('bestemail_from_name', get_bloginfo('name')),
            'from_email' => get_option('bestemail_from_email', get_option('admin_email')),
            'list_id' => $list_id,
            'track_opens' => get_option('bestemail_track_opens', 1),
            'track_clicks' => get_option('bestemail_track_clicks', 1)
        );
        
        // Parse headers if provided
        if (!empty($headers)) {
            if (!is_array($headers)) {
                $headers = explode("\n", str_replace("\r\n", "\n", $headers));
            }
            
            foreach ($headers as $header) {
                if (strpos($header, 'From:') === 0) {
                    $from = trim(str_replace('From:', '', $header));
                    if (preg_match('/(.+)\s<(.+)>/', $from, $matches)) {
                        $data['from_name'] = $matches[1];
                        $data['from_email'] = $matches[2];
                    } else {
                        $data['from_email'] = $from;
                    }
                }
            }
        }
        
        // Send via Bestemail
        $response = wp_remote_post('https://my.bestemail.in/api/send', array(
            'body' => $data,
            'timeout' => 30
        ));
        
        if (is_wp_error($response)) {
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        return $body === 'Email sent';
    }
}

// Add subscription widget
class Bestemail_Widget extends WP_Widget {
    
    function __construct() {
        parent::__construct(
            'bestemail_widget',
            'Bestemail Subscription',
            array('description' => 'Email subscription form for Bestemail')
        );
    }
    
    public function widget($args, $instance) {
        echo $args['before_widget'];
        
        if (!empty($instance['title'])) {
            echo $args['before_title'] . apply_filters('widget_title', $instance['title']) . $args['after_title'];
        }
        
        ?>
        <form class="bestemail-widget-form" method="post">
            <p>
                <input type="email" name="bestemail_email" placeholder="Enter your email" required style="width: 100%;" />
            </p>
            <p>
                <input type="text" name="bestemail_name" placeholder="Your name (optional)" style="width: 100%;" />
            </p>
            <p>
                <input type="submit" value="Subscribe" class="button button-primary" style="width: 100%;" />
            </p>
        </form>
        <?php
        
        echo $args['after_widget'];
    }
    
    public function form($instance) {
        $title = !empty($instance['title']) ? $instance['title'] : 'Subscribe to Newsletter';
        ?>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('title')); ?>">Title:</label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" 
                   name="<?php echo esc_attr($this->get_field_name('title')); ?>" 
                   type="text" value="<?php echo esc_attr($title); ?>">
        </p>
        <?php
    }
    
    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = (!empty($new_instance['title'])) ? strip_tags($new_instance['title']) : '';
        return $instance;
    }
}

// Register widget
add_action('widgets_init', function() {
    register_widget('Bestemail_Widget');
});

// Handle widget form submission
add_action('init', 'bestemail_handle_subscription');
function bestemail_handle_subscription() {
    if (isset($_POST['bestemail_email']) && is_email($_POST['bestemail_email'])) {
        $api_key = get_option('bestemail_api_key');
        $list_id = get_option('bestemail_list_id');
        
        if (!empty($api_key) && !empty($list_id)) {
            $data = array(
                'api_key' => $api_key,
                'list' => $list_id,
                'email' => sanitize_email($_POST['bestemail_email']),
                'name' => sanitize_text_field($_POST['bestemail_name'] ?? '')
            );
            
            wp_remote_post('https://my.bestemail.in/api/subscribe', array(
                'body' => $data,
                'timeout' => 30
            ));
        }
    }
}